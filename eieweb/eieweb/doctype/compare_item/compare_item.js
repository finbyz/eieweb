// Copyright (c) 2020, Finbyz Tech Pvt Ltd and contributors
// For license information, please see license.txt
cur_frm.fields_dict.items.grid.get_field("item_code").get_query = function(doc) {
	return {
		filters: {
			'show_in_website': 1
		}
	}
};

frappe.ui.form.on('Compare Item', {
	// refresh: function(frm) {

	// }
});
