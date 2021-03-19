from __future__ import unicode_literals
import frappe
from frappe import _
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


from frappe.website.utils import is_signup_enabled
from frappe.utils import escape_html

@frappe.whitelist(allow_guest=True)
def sign_up(email, full_name, company, mobile, redirect_to):
	if not is_signup_enabled():
		frappe.throw(_('Sign Up is disabled'), title='Not Allowed')

	user = frappe.db.get("User", {"email": email})
	if user:
		if user.disabled:
			return 0, _("Registered but disabled")
		else:
			return 0, _("Already Registered")
	else:
		if frappe.db.sql("""select count(*) from tabUser where
			HOUR(TIMEDIFF(CURRENT_TIMESTAMP, TIMESTAMP(modified)))=1""")[0][0] > 300:

			frappe.respond_as_web_page(_('Temporarily Disabled'),
				_('Too many users signed up recently, so the registration is disabled. Please try back in an hour'),
				http_status_code=429)

		from frappe.utils import random_string
		user = frappe.get_doc({
			"doctype":"User",
			"email": email,
			"mobile_no": mobile,
			"interest": company,
			"first_name": escape_html(full_name),
			"enabled": 1,
			"new_password": random_string(10),
			"user_type": "Website User"
		})
		user.flags.ignore_permissions = True
		user.flags.ignore_password_policy = True
		user.insert()

		# set default signup role as per Portal Settings
		default_role = frappe.db.get_value("Portal Settings", None, "default_role")
		if default_role:
			user.add_roles(default_role)

		if redirect_to:
			frappe.cache().hset('redirect_after_login', user.name, redirect_to)

		if user.flags.email_sent:
			return 1, _("Please check your email for verification")
		else:
			return 2, _("Please ask your administrator to verify your sign-up")


def create_customer_or_supplier():
	'''Based on the default Role (Customer, Supplier), create a Customer / Supplier.
	Called on_session_creation hook.
	'''
	from erpnext.shopping_cart.cart import get_debtors_account
	from frappe.utils.nestedset import get_root_of
	from erpnext.shopping_cart.doctype.shopping_cart_settings.shopping_cart_settings import get_shopping_cart_settings

	user = frappe.session.user
	if frappe.db.get_value('User', user, 'user_type') != 'Website User':
		return

	user_roles = frappe.get_roles()
	portal_settings = frappe.get_single('Portal Settings')
	default_role = portal_settings.default_role

	if default_role not in ['Customer', 'Supplier']:
		return

	# create customer / supplier if the user has that role
	if portal_settings.default_role and portal_settings.default_role in user_roles:
		doctype = portal_settings.default_role
	else:
		doctype = None

	if not doctype:
		return

	if party_exists(doctype, user):
		return

	party = frappe.new_doc(doctype)
	fullname = frappe.utils.get_fullname(user)

	if doctype == 'Customer':
		cart_settings = get_shopping_cart_settings()

		if cart_settings.enable_checkout:
			debtors_account = get_debtors_account(cart_settings)
		else:
			debtors_account = ''

		party.update({
			"customer_name": fullname,
			"customer_type": "Individual",
			"customer_group": cart_settings.default_customer_group,
			"territory": get_root_of("Territory"),
			"disabled": 0
		})

		if debtors_account:
			party.update({
				"accounts": [{
					"company": cart_settings.company,
					"account": debtors_account
				}]
			})
	else:
		party.update({
			"supplier_name": fullname,
			"supplier_group": "All Supplier Groups",
			"supplier_type": "Individual"
		})

	party.flags.ignore_mandatory = True
	party.insert(ignore_permissions=True)

	contact = frappe.new_doc("Contact")
	contact.update({
		"first_name": fullname,
		"email_id": user
	})
	contact.append('links', dict(link_doctype=doctype, link_name=party.name))
	contact.flags.ignore_mandatory = True
	contact.insert(ignore_permissions=True)

	return party

def party_exists(doctype, user):
	contact_name = frappe.db.get_value("Contact", {"email_id": user})

	if contact_name:
		contact = frappe.get_doc('Contact', contact_name)
		doctypes = [d.link_doctype for d in contact.links]
		return doctype in doctypes

	return False