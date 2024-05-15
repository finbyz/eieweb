
from __future__ import unicode_literals
import frappe

def get_context(context):
	return { "doc": frappe.get_doc("About Us Settings", "About Us Settings"),"employee": frappe.get_list("Employee",{'status':'Active'}, ['first_name', 'last_name', 'image'],ignore_permissions=True) }