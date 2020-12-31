# -*- coding: utf-8 -*-
# Copyright (c) 2020, Finbyz Tech Pvt Ltd and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.utils import flt
from frappe.model.document import Document

class ItemSequence(Document):
	def validate(self):
		frappe.db.sql('update tabItem set weightage = 0 where show_in_website = 1')
		length = len(self.items) + 1
		for row in self.items:
			frappe.db.set_value("Item",row.item_code,'weightage',flt(length - row.idx))
