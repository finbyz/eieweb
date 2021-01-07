# -*- coding: utf-8 -*-
# Copyright (c) 2020, Finbyz Tech Pvt Ltd and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from erpnext.stock.doctype.item.item import get_variant

class ItemAsVariant(Document):
	def on_submit(self):
		attr_list = [attr.attribute for attr in self.attributes]
		doc_template = frappe.get_doc("Item",self.template)
		for attr in doc_template.attributes:
			if attr.attribute not in attr_list:
				frappe.throw(frappe.bold(str(attr.attribute)) + " should be in included in the Attributes" )

		args = {}
		for d in self.attributes:
			args[d.attribute] = d.attribute_value

		variant = get_variant(self.template,args)
		if variant:
			if frappe.db.get_value("Item",variant,'disabled') != 1:
				frappe.throw("Item variant {0} exists with same attributes".format(variant))

		doc = frappe.get_doc("Item",self.make_variant)
		#doc.variant_of = self.template
		doc.db_set('variant_of',self.template)
		doc.db_set('show_in_website', 0)

		for attr in self.attributes:
			doc.append('attributes',{
				'attribute':attr.attribute,
				'attribute_value':attr.attribute_value,
				'variant_of':self.template
			})
		doc.save()
	
	def on_cancel(self):
		doc = frappe.get_doc('Item',self.make_variant)
		if doc.variant_of == self.template:
			doc.db_set('variant_of',None)
			doc.attributes = []
			doc.save()

@frappe.whitelist()
def item_cancel(doc):
	doc_item = frappe.get_doc("Item",doc)
	if doc_item.variant_of:
		doc_item.db_set('variant_of',None)
		doc_item.attributes = []
		doc_item.save()
		return True