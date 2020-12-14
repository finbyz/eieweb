import frappe
from eieweb.eieweb.doctype.website_itemgroup.website_itemgroup import get_parent_item_groups
from erpnext.stock.doctype.item.item import Item

def get_items(filters=None, search=None):
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
			`tabItem`.`weightage` DESC
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
	description =  description.replace('lt;o:p&gt;','')
	description =  description.replace('&lt;/o:p&gt;','')
	self.db_set('description',description)