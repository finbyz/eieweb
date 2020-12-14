# -*- coding: utf-8 -*-
# Copyright (c) 2020, Finbyz Tech Pvt Ltd and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class ItemAsVariant(Document):
	def on_submit(self):
		attr_list = [attr.attribute for attr in self.attributes]
		doc_template = frappe.get_doc("Item",self.template)
		for attr in doc_template.attributes:
			if attr.attribute not in attr_list:
				frappe.throw(frappe.bold(str(attr.attribute)) + " should be in included in the Attributes" )

		doc = frappe.get_doc("Item",self.make_variant)
		doc.db_set('variant_of',self.template)
		#doc.variant_of = self.template
		for attr in self.attributes:
			doc.append('attributes',{
				'attribute':attr.attribute,
				'attribute_value':attr.attribute_value,
				'variant_of':self.template
			})
		doc.save()