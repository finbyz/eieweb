import frappe.utils
from webshop.webshop.doctype.website_item.website_item import WebsiteItem as _WebsiteGenerator, update_index_for_item, invalidate_item_variants_cache_for_website
import frappe
from eieweb.eieweb.doctype.website_itemgroup.website_itemgroup import get_parent_item_groups
from frappe import _
from frappe.website.utils import clear_cache
from frappe.website.doctype.website_slideshow.website_slideshow import get_slideshow
from eie.eie.doc_events.website_item import set_attribute_context, set_disabled_attributes
from webshop.webshop.doctype.item_review.item_review import get_item_reviews


class WebsiteItem(_WebsiteGenerator):
	website = frappe._dict(
		page_title_field="web_item_name",
		condition_field="published",
		template="templates/generators/item/item.html",
		no_cache=1,
	)
	
	def get_context(self, context):
		context = super().get_context(context)
		context.full_witdh = 1

		website_itemgroup = None

		if self.website_item_groups:
			website_itemgroup = self.website_item_groups[0].website_itemgroup

		context.parents = get_parent_item_groups(
			website_itemgroup, from_item=True
		)  # breadcumbs

		context.variants = frappe.db.get_all("Item", filters={"variant_of": self.item_code})
		variant = frappe.form_dict.variant
		if not variant:
			if self.has_variants:
				variant = context.variants[0]
		if variant:
			context.variant = frappe.get_doc("Item", variant)
			for fieldname in ("website_image", "website_image_alt", "web_long_description", "description",
									"website_specifications"):
				if context.variant.get(fieldname):
					value = context.variant.get(fieldname)
					if isinstance(value, list):
						value = [d.as_dict() for d in value]

					context[fieldname] = value
		# if self.has_variants:
		# 	context.variant = context.variants[0]
		# context.parents = get_parent_item_groups(self.item_group, from_item=True)  # breadcumbs

		context.attributes = self.attributes = frappe.get_all(
			"Item Variant Attribute",
			fields=["attribute", "attribute_value"],
			filters={"parent": self.item_code},
		)
		set_attribute_context(self, context)
		set_disabled_attributes(self, context)
		if self.slideshow:
			context.update(get_slideshow(self))
				
			# self.set_disabled_attributes(context)
		self.set_metatags(context)
		self.set_shopping_cart_data(context)

		settings = context.shopping_cart.cart_settings

		self.get_product_details_section(context)

		if settings.get("enable_reviews"):
			reviews_data = get_item_reviews(self.name)
			context.update(reviews_data)
			context.reviews = context.reviews[:4]

		context.wished = False
		if frappe.db.exists(
			"Wishlist Item", {"item_code": self.item_code, "parent": frappe.session.user}
		):
			context.wished = True


		context.recommended_items = None
		if settings and settings.enable_recommendations:
			context.recommended_items = self.get_recommended_items(settings)
		return context
	
	def get_product_details_section(self, context):
		"""Get section with tabs or website specifications."""
		context.show_tabs = self.show_tabbed_section or 1
		if self.show_tabbed_section:
			context.tabs = self.get_tabs()
		else:
			context.website_specifications = self.website_specifications
	

	def get_tabs(self):
		tab_values = {}

		website_template = ''
		if frappe.utils.strip_html(self.web_long_description or ''):
			website_template = self.web_long_description
		elif frappe.utils.strip_html(self.description or ''):
			website_template = self.description
		
		doc = frappe.get_doc("Item", self.item_code)
		index = 1

		if website_template:
			tab_values[f"tab_{index}_title"] = "More Information"
			tab_values[f"tab_{index}_content"] = frappe.render_template(
				"templates/generators/item/item_description.html",
				{
					"website_description": website_template,
				},
			)
			index += 1

		if doc.specifications:
			tab_values[f"tab_{index}_title"] = "Techincal Specification"
			tab_values[f"tab_{index}_content"] = frappe.render_template(
				"templates/generators/item/item_specifications.html",
				{
					"website_specifications": doc.specifications,
					"show_tabs": self.show_tabbed_section,
				},
			)

			index += 1
		
		if doc.optional_accessories:
			tab_values[f"tab_{index}_title"] = "Accessories"
			tab_values[f"tab_{index}_content"] = frappe.render_template(
				"templates/generators/item/item_accessories.html",
				{
					"doc": self,
				},
			)
			index += 1
		if doc.spares:
			tab_values[f"tab_{index}_title"] = "Spares"
			tab_values[f"tab_{index}_content"] = frappe.render_template(
				"templates/generators/item/item_spares.html",
				{
					"doc": self,
				},
			)

			index += 1
			
		for row in self.tabs:
			tab_values[f"tab_{index + row.idx}_title"] = _(row.label)
			tab_values[f"tab_{index + row.idx}_content"] = row.content
			

		return tab_values

	def on_update(self):
		invalidate_cache_for_web_item(self)
		self.update_template_item()


def invalidate_cache_for_web_item(doc):
	"""
	Invalidate Website Item Group cache and rebuild ItemVariantsCacheManager
	Args:
		doc (Item): document against which cache should be cleared
	"""
	invalidate_cache_for(doc)

	website_item_groups = list(
		set(
			(doc.get("old_website_item_groups") or [])
			+ [
				d.website_itemgroup
				for d in doc.get({"doctype": "Website Item Group"})
				if d.website_itemgroup
			]
		)
	)
	 

	for item_group in website_item_groups:
		invalidate_cache_for(doc, item_group)

	# Update Search Cache
	update_index_for_item(doc)

	invalidate_item_variants_cache_for_website(doc)


def invalidate_cache_for(doc, item_group=None):
	if not item_group:
		item_group = doc.item_group
	
	if doc.doctype == "Website Itemgroup":
		item_group = doc.name

		for d in get_parent_item_groups(item_group):
			item_group_name = frappe.db.get_value("Website Itemgroup", d.get("name"))
			if item_group_name:
				clear_cache(frappe.db.get_value("Website Itemgroup", item_group_name, "route"))
	
	if doc.doctype == "Website Item":
		for row in doc.get("website_item_groups"):
			item_group = row.website_itemgroup

			for d in get_parent_item_groups(item_group):
				item_group_name = frappe.db.get_value("Website Itemgroup", d.get("name"))
				if item_group_name:
					clear_cache(frappe.db.get_value("Website Itemgroup", item_group_name, "route"))