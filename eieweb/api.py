from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from eieweb.eieweb.doctype.website_itemgroup.website_itemgroup import get_parent_item_groups
from erpnext.stock.doctype.item.item import Item
from erpnext.controllers.website_list_for_contact import get_list_for_transactions, rfq_transaction_list, get_customers_suppliers, post_process
import json

def get_items(filters=None, search=None):
	frappe.msgprint('call')
	start = frappe.form_dict.start or 0
	products_settings = get_product_settings()
	page_length = products_settings.products_per_page

	filters = filters or []
	# convert to list of filters
	if isinstance(filters, dict):
		filters = [['Item', fieldname, '=', value] for fieldname, value in filters.items()]

	enabled_items_filter = get_conditions({ 'disabled': 0 }, 'and')

	show_in_website_condition = ''
	if products_settings.hide_variants:
		show_in_website_condition = get_conditions({'show_in_website': 1 }, 'and')
	else:
		show_in_website_condition = get_conditions([
			['show_in_website', '=', 1],
			['show_variant_in_website', '=', 1]
		], 'or')

	search_condition = ''
	if search:
		# Default fields to search from
		default_fields = {'name', 'item_name', 'description', 'item_group'}

		# Get meta search fields
		meta = frappe.get_meta("Item")
		meta_fields = set(meta.get_search_fields())

		# Join the meta fields and default fields set
		search_fields = default_fields.union(meta_fields)
		try:
			if frappe.db.count('Item', cache=True) > 50000:
				search_fields.remove('description')
		except KeyError:
			pass

		# Build or filters for query
		search = '%{}%'.format(search)
		or_filters = [[field, 'like', search] for field in search_fields]

		search_condition = get_conditions(or_filters, 'or')

	filter_condition = get_conditions(filters, 'and')

	where_conditions = ' and '.join(
		[condition for condition in [enabled_items_filter, show_in_website_condition, \
			search_condition, filter_condition] if condition]
	)

	left_joins = []
	for f in filters:
		if len(f) == 4 and f[0] != 'Item':
			left_joins.append(f[0])

	left_join = ' '.join(['LEFT JOIN `tab{0}` on (`tab{0}`.parent = `tabItem`.name)'.format(l) for l in left_joins])

	results = frappe.db.sql('''
		SELECT
			`tabItem`.`name`, `tabItem`.`item_name`,
			`tabItem`.`website_image`, `tabItem`.`image`,
			`tabItem`.`web_long_description`, `tabItem`.`description`,
			`tabItem`.`route`, `tabItem`.`small_description`
		FROM
			`tabItem`
		{left_join}
		WHERE
			{where_conditions}
		GROUP BY
			`tabItem`.`name`
		ORDER BY
			`tabItem`.`weightage` DESC,
			`tabItem`.`item_sequence` ASC
		LIMIT
			{page_length}
		OFFSET
			{start}
	'''.format(
			where_conditions=where_conditions,
			start=start,
			page_length=page_length,
			left_join=left_join
		)
	, as_dict=1)

	for r in results:
		r.description = r.web_long_description or r.description
		r.image = r.website_image or r.image

	return results


def get_context(self, context):
	context.show_search = True
	context.search_link = '/product_search'

	#context.parents = get_parent_item_groups(self.item_group)

	context.parents = get_parent_item_groups(self.website_itemgroup)

	self.set_variant_context(context)
	self.set_attribute_context(context)
	self.set_disabled_attributes(context)
	self.set_metatags(context)
	self.set_shopping_cart_data(context)

	return context

@frappe.whitelist()
def get_item_compare(item_group):
    return frappe.get_all("Item",{'website_itemgroup':item_group,'show_in_website':1})

def item_validate(self,method):
	description =  self.description.replace('&lt;o:p&gt;&lt;/o:p&gt;','')
	description =  description.replace('&lt;o:p&gt;','')
	description =  description.replace('&lt;/o:p&gt;','')
	description = description.replace('&lt;font color="#000000"&gt;','')
	description = description.replace('&lt;/font&gt;','')
	self.db_set('description',description)
	if self.variant_of:
		self.db_set('show_in_website',0)

@frappe.whitelist(allow_guest=True)
def set_form_data(lead_name,company_name,message,mobile_no,product_name, title,email):
	data = frappe.new_doc("Lead")
	data.lead_name = lead_name
	data.company_name = company_name
	data.message = message
	data.mobile_no = mobile_no
	data.product_name = product_name
	data.source = 'Website'
	data.notes = title
	data.email_id = email
	data.save(ignore_permissions=True)
	frappe.db.commit()


def quotation_get_list_context(context=None):
	list_context = get_list_context(context)
	list_context.update({
		'show_sidebar': True,
		'show_search': True,
		'no_breadcrumbs': True,
		'title': _('Quotations'),
	})

	return list_context


def get_list_context(context=None):
	return {
		"global_number_format": frappe.db.get_default("number_format") or "#,###.##",
		"currency": frappe.db.get_default("currency"),
		"currency_symbols": json.dumps(dict(frappe.db.sql("""select name, symbol
			from tabCurrency where enabled=1"""))),
		"row_template": "eieweb/templates/includes/transaction_row.html",
		"get_list": get_transaction_list
	}

def get_transaction_list(doctype, txt=None, filters=None, limit_start=0, limit_page_length=20, order_by="modified"):
	user = frappe.session.user
	ignore_permissions = False

	if not filters: filters = []

	if doctype in ['Supplier Quotation', 'Purchase Invoice', 'Quotation']:
		filters.append((doctype, 'docstatus', '<', 2))
	else:
		filters.append((doctype, 'docstatus', '=', 1))

	if (user != 'Guest' and is_website_user()) or doctype == 'Request for Quotation':
		parties_doctype = 'Request for Quotation Supplier' if doctype == 'Request for Quotation' else doctype
		# find party for this contact
		customers, suppliers = get_customers_suppliers(parties_doctype, user)

		if customers:
			if doctype == 'Quotation':
				filters.append(('quotation_to', '=', 'Customer'))
				filters.append(('party_name', 'in', customers))
			else:
				filters.append(('customer', 'in', customers))
		elif suppliers:
			filters.append(('supplier', 'in', suppliers))
		else:
			return []

		if doctype == 'Request for Quotation':
			parties = customers or suppliers
			return rfq_transaction_list(parties_doctype, doctype, parties, limit_start, limit_page_length)

		# Since customers and supplier do not have direct access to internal doctypes
		ignore_permissions = True

	transactions = get_list_for_transactions(doctype, txt, filters, limit_start, limit_page_length,
		fields='name', ignore_permissions=ignore_permissions, order_by='modified desc')

	return post_process(doctype, transactions)