# -*- coding: utf-8 -*-
# Copyright (c) 2020, Finbyz Tech Pvt Ltd and contributors
# For license information, please see license.txt

import frappe
import copy
from frappe import _
from frappe.utils import nowdate, cint, cstr
from frappe.utils.nestedset import NestedSet
from frappe.website.website_generator import WebsiteGenerator
from frappe.website.utils import clear_cache # path has been changed
from frappe.website.doctype.website_slideshow.website_slideshow import get_slideshow
from erpnext.e_commerce.shopping_cart.product_info import set_product_info_for_website
# from erpnext.shopping_cart.product_info import set_product_info_for_website # above line is added for same
from erpnext.utilities.product import get_web_item_qty_in_stock
from six.moves.urllib.parse import quote


class WebsiteItemgroup(NestedSet, WebsiteGenerator):
	nsm_parent_field = 'parent_website_itemgroup'
	website = frappe._dict(
		condition_field = "show_in_website",
		template = "templates/generators/item_group.html",
		no_cache = 1
	)

	def autoname(self):
		self.name = self.website_itemgroup_name

	def validate(self):
		#super(WebsiteItemgroup, self).validate()

		if not self.parent_website_itemgroup and not frappe.flags.in_test:
			if frappe.db.exists("Website Itemgroup", _('All Item Groups')):
				self.parent_website_itemgroup = _('All Item Groups')

		self.make_route()

	def on_update(self):
		NestedSet.on_update(self)
		invalidate_cache_for(self)
		self.validate_name_with_item()
		self.validate_one_root()
		self.delete_child_item_groups_key()

	def make_route(self):
		'''Make website route'''
		if not self.route:
			self.route = ''
			if self.parent_website_itemgroup:
				parent_website_itemgroup = frappe.get_doc('Website Itemgroup', self.parent_website_itemgroup)

				# make parent route only if not root
				if parent_website_itemgroup.parent_website_itemgroup and parent_website_itemgroup.route:
					self.route = parent_website_itemgroup.route + '/'

			self.route += frappe.scrub(self.website_itemgroup_name)

			return self.route

	def on_trash(self):
		NestedSet.on_trash(self)
		WebsiteGenerator.on_trash(self)
		self.delete_child_item_groups_key()

	def validate_name_with_item(self):
		if frappe.db.exists("Item", self.name):
			frappe.throw(frappe._("An item exists with same name ({0}), please change the item group name or rename the item").format(self.name), frappe.NameError)

	def get_context(self, context):
		context.show_search=True
		context.page_length = cint(frappe.db.get_single_value('Products Settings', 'products_per_page')) or 8
		context.search_link = '/product_search'

		start = int(frappe.form_dict.start or 0)
		if start < 0:
			start = 0
		context.update({
			"items": get_product_list_for_group(product_group = self.name, start=start,
				limit=context.page_length + 1, search=frappe.form_dict.get("search")),
			"parents": get_parent_item_groups(self.parent_website_itemgroup),
			"title": self.name
		})
		
		if self.slideshow:
			context.update(get_slideshow(self))

		return context

	def delete_child_item_groups_key(self):
		frappe.cache().hdel("child_item_groups", self.name)

@frappe.whitelist(allow_guest=True)
def get_product_list_for_group(product_group=None, start=0, limit=10, search=None):
	if product_group:
		item_group = frappe.get_cached_doc('Website Itemgroup', product_group)
		if item_group.is_group:
			# return child item groups if the type is of "Is Group"
			return get_child_groups_for_list_in_html(item_group, start, limit, search)

	child_groups = ", ".join([frappe.db.escape(i[0]) for i in get_child_groups(product_group)])

	# base query
	query = """select I.name, I.item_name, I.item_code, I.route, I.image, I.website_image, I.thumbnail, I.item_group,
			I.description, I.web_long_description as website_description, I.is_stock_item,
			case when (S.actual_qty - S.reserved_qty) > 0 then 1 else 0 end as in_stock, I.website_warehouse,
			I.has_batch_no
		from `tabItem` I
		left join tabBin S on I.item_code = S.item_code and I.website_warehouse = S.warehouse
		where I.show_in_website = 1
			and I.disabled = 0
			and (I.end_of_life is null or I.end_of_life='0000-00-00' or I.end_of_life > %(today)s)
			and (I.variant_of = '' or I.variant_of is null)
			and (I.website_itemgroup in ({child_groups})
			or I.name in (select parent from `tabWebsite Item Group` where website_itemgroup in ({child_groups})))
			""".format(child_groups=child_groups)
	# search term condition
	if search:
		query += """ and (I.web_long_description like %(search)s
				or I.item_name like %(search)s
				or I.name like %(search)s)"""
		search = "%" + cstr(search) + "%"

	query += """order by I.weightage desc, in_stock desc, I.modified desc limit %s, %s""" % (cint(start), cint(limit))

	data = frappe.db.sql(query, {"product_group": product_group,"search": search, "today": nowdate()}, as_dict=1)
	data = adjust_qty_for_expired_items(data)

	if cint(frappe.db.get_single_value("Shopping Cart Settings", "enabled")):
		for item in data:
			set_product_info_for_website(item)

	return data

def get_child_groups_for_list_in_html(item_group, start, limit, search):
	search_filters = None
	if search_filters:
		search_filters = [
			dict(name = ('like', '%{}%'.format(search))),
			dict(description = ('like', '%{}%'.format(search)))
		]
	data = frappe.db.get_all('Website Itemgroup',
		fields = ['name', 'route', 'description', 'image'],
		filters = dict(
			show_in_website = 1,
			parent_website_itemgroup = item_group.name,
			lft = ('>', item_group.lft),
			rgt = ('<', item_group.rgt),
		),
		or_filters = search_filters,
		order_by = 'name asc',
		start = start,
		limit = limit
	)

	return data

def adjust_qty_for_expired_items(data):
	adjusted_data = []

	for item in data:
		if item.get('has_batch_no') and item.get('website_warehouse'):
			stock_qty_dict = get_qty_in_stock(
				item.get('name'), 'website_warehouse', item.get('website_warehouse'))
			qty = stock_qty_dict.stock_qty[0][0] if stock_qty_dict.stock_qty else 0
			item['in_stock'] = 1 if qty else 0
		adjusted_data.append(item)

	return adjusted_data


def get_child_groups(website_itemgroup_name):
	item_group = frappe.get_doc("Website Itemgroup", website_itemgroup_name)
	return frappe.db.sql("""select name
		from `tabWebsite Itemgroup` where lft>=%(lft)s and rgt<=%(rgt)s
			and show_in_website = 1""", {"lft": item_group.lft, "rgt": item_group.rgt})

def get_child_item_groups(website_itemgroup_name):
	item_group = frappe.get_cached_value("Website Itemgroup",
		website_itemgroup_name, ["lft", "rgt"], as_dict=1)

	child_item_groups = [d.name for d in frappe.get_all('Website Itemgroup',
		filters= {'lft': ('>=', item_group.lft),'rgt': ('<=', item_group.rgt)})]

	return child_item_groups or {}

def get_item_for_list_in_html(context):
	# add missing absolute link in files
	# user may forget it during upload
	if (context.get("website_image") or "").startswith("files/"):
		context["website_image"] = "/" + quote(context["website_image"])

	context["show_availability_status"] = cint(frappe.db.get_single_value('Products Settings',
		'show_availability_status'))

	products_template = 'templates/includes/products_as_list.html'

	return frappe.get_template(products_template).render(context)

def get_group_item_count(item_group):
	child_groups = ", ".join(['"' + i[0] + '"' for i in get_child_groups(item_group)])
	return frappe.db.sql("""select count(*) from `tabItem`
		where docstatus = 0 and show_in_website = 1
		and (website_itemgroup in (%s)
			or name in (select parent from `tabWebsite Item Group`
				where website_itemgroup in (%s))) """ % (child_groups, child_groups))[0][0]


def get_parent_item_groups(website_itemgroup_name, from_item=False):
	base_nav_page = {"name": _("Shop by Category"), "route": "/shop-by-category"}

	if from_item and frappe.request.environ.get("HTTP_REFERER"):
		# base page after 'Home' will vary on Item page
		last_page = frappe.request.environ["HTTP_REFERER"].split("/")[-1]
		if last_page and last_page in ("shop-by-category", "all-products"):
			base_nav_page_title = " ".join(last_page.split("-")).title()
			base_nav_page = {"name": _(base_nav_page_title), "route": "/" + last_page}

	base_parents = [
		{"name": _("Home"), "route": "/"},
		base_nav_page,
	]
	if not website_itemgroup_name:
		return base_parents

	item_group = frappe.get_doc("Website Itemgroup", website_itemgroup_name)
	parent_groups = frappe.db.sql("""select name, route from `tabWebsite Itemgroup`
		where lft <= %s and rgt >= %s
		and show_in_website=1
		order by lft asc""", (item_group.lft, item_group.rgt), as_dict=True)

	return base_parents + parent_groups

def invalidate_cache_for(doc, item_group=None):
	if not item_group:
		item_group = doc.name

	for d in get_parent_item_groups(item_group):
		website_itemgroup_name = frappe.db.get_value("Website Itemgroup", d.get('name'))
		# if website_itemgroup_name:
		# 	clear_cache(frappe.db.get_value('Website Itemgroup', website_itemgroup_name, 'route'))

def get_item_group_defaults(item, company):
	item = frappe.get_cached_doc("Item", item)
	item_group = frappe.get_cached_doc("Website Itemgroup", item.item_group)

	for d in item_group.item_group_defaults or []:
		if d.company == company:
			row = copy.deepcopy(d.as_dict())
			row.pop("name")
			return row

	return frappe._dict()

