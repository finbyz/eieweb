// Copyright (c) 2020, Finbyz Tech Pvt Ltd and contributors
// For license information, please see license.txt
cur_frm.fields_dict.make_variant.get_query = function (doc) {
	return {
		filters: {
			"variant_of": ''
		}
	}
};
cur_frm.fields_dict.template.get_query = function (doc) {
	return {
		filters: {
			"has_variants":1 
		}
	}
};
frappe.ui.form.on('Item As Variant', {
	// refresh: function(frm) {

	// }
	template: function(frm){
		frm.doc.attributes = []
		frappe.model.with_doc("Item", frm.doc.template, function(){
			let tabletransfer = frappe.get_doc("Item", frm.doc.template)
			$.each(tabletransfer.attributes, function(index, row){
				let d = cur_frm.add_child("attributes");
				d.attribute = row.attribute;
				frm.refresh_field("attributes");
			});
		});		
	}
});
