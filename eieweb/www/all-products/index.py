import frappe
from erpnext.e_commerce.product_data_engine.filters import ProductFiltersBuilder
from erpnext.e_commerce.variant_selector.utils import get_item_codes_by_attributes
from eieweb.api import get_items

sitemap = 1

def get_product_settings():
	doc = frappe.get_cached_doc('Products Settings')
	doc.products_per_page = doc.products_per_page or 20
	return doc

def get_items_by_fields(field_filters):
	meta = frappe.get_meta('Item')
	filters = []
	for fieldname, values in field_filters.items():
		if not values: continue

		_doctype = 'Item'
		_fieldname = fieldname

		df = meta.get_field(fieldname)
		if df.fieldtype == 'Table MultiSelect':
			child_doctype = df.options
			child_meta = frappe.get_meta(child_doctype)
			fields = child_meta.get("fields", { "fieldtype": "Link", "in_list_view": 1 })
			if fields:
				_doctype = child_doctype
				_fieldname = fields[0].fieldname

		if len(values) == 1:
			filters.append([_doctype, _fieldname, '=', values[0]])
		else:
			filters.append([_doctype, _fieldname, 'in', values])

	return get_items(filters)

def get_products_for_website(field_filters=None, attribute_filters=None, search=None):
	if attribute_filters:
		item_codes = get_item_codes_by_attributes(attribute_filters)
		items_by_attributes = get_items([['name', 'in', item_codes]])

	if field_filters:
		items_by_fields = get_items_by_fields(field_filters)

	if attribute_filters and not field_filters:
		return items_by_attributes

	if field_filters and not attribute_filters:
		return items_by_fields

	if field_filters and attribute_filters:
		items_intersection = []
		item_codes_in_attribute = [item.name for item in items_by_attributes]

		for item in items_by_fields:
			if item.name in item_codes_in_attribute:
				items_intersection.append(item)

		return items_intersection

	if search:
		return get_items(search=search)

	return get_items()

def get_context(context):
    
	if frappe.form_dict:
		search = frappe.form_dict.search
		field_filters = frappe.parse_json(frappe.form_dict.field_filters)
		attribute_filters = frappe.parse_json(frappe.form_dict.attribute_filters)
		start = frappe.parse_json(frappe.form_dict.start)
	else:
		search = field_filters = attribute_filters = None
		start = 0

	# engine = ProductQuery()
	# context.items = engine.query(attribute_filters, field_filters, search, start)

    # finbyz change
	context.items = get_products_for_website(field_filters, attribute_filters,search)
    
	# Add homepage as parent
	context.parents = [{"name": frappe._("Home"), "route":"/"}]

	product_settings = get_product_settings()
	filter_engine = ProductFiltersBuilder()

	context.field_filters = filter_engine.get_field_filters()
	context.attribute_filters = filter_engine.get_attribute_fitlers()

	context.product_settings = product_settings
	context.body_class = "product-page"
	context.page_length = product_settings.products_per_page or 20

	context.no_cache = 1
