
from __future__ import unicode_literals
import frappe
import re
#import urllib.parse

def get_context(context):
	final_dict = {}
	specification_dict = {}

	url = frappe.request.url.rsplit('?', 1)[-1].replace('%20',' ')
	if url:
		final_dict.update({"url": url})
	item_group = get_param_from_url(url,'item_group')
	if item_group:
		final_dict.update({"selected_group": item_group})
		selected_option = frappe.get_all("Website Itemgroup",{'show_in_website':1,'is_group':0}, order_by="priority")
	item1 = get_param_from_url(url,'item1')
	item2 = get_param_from_url(url,'item2')
	item3 = get_param_from_url(url,'item3')
	item4 = get_param_from_url(url,'item4')
	final_dict.update({'item1':item1, 'item2': item2,'item3': item3, 'item4': item4})
	if item1:
		item1_doc = frappe.get_doc("Item",item1)
		for d in item1_doc.specifications:
			if d.value:
	   			specification_dict.update({d.specification:{'item1':d.value}})
		
	if item2:
		item2_doc = frappe.get_doc("Item",item2)
		for d in item2_doc.specifications:
			if d.value:
				if d.specification in specification_dict.keys():
					specification_dict[d.specification]['item2'] = d.value
				else:
					specification_dict.update({d.specification:{'item2':d.value}})
	
	if item3:
		item3_doc = frappe.get_doc("Item",item3)
		for d in item3_doc.specifications:
			if d.value:
				if d.specification in specification_dict.keys():
					specification_dict[d.specification]['item3'] = d.value
				else:
					specification_dict.update({d.specification:{'item3':d.value}})
	
	if item4:
		item4_doc = frappe.get_doc("Item",item4)
		for d in item4_doc.specifications:
			if d.value:
				if d.specification in specification_dict.keys():
					specification_dict[d.specification]['item4'] = d.value
				else:
					specification_dict.update({d.specification:{'item4':d.value}})
	
	final_dict.update({"specification_dict": specification_dict})
	return final_dict
	
def get_param_from_url(url, param_name):
	if re.search(param_name,url):
		return [i.split("=")[-1] for i in url.split("?", 1)[-1].split("&") if i.startswith(param_name + "=")][0]