cur_frm.fields_dict.website_itemgroup.get_query = function(doc) {
	return {
		filters: {
			"is_group": 0,
		}
	}   
};
frappe.ui.form.on("Item", {
    refresh: function(frm) {
        if(frm.doc.show_in_website){
            cur_frm.set_df_property("website_itemgroup", "reqd",1);
        }
        else{
            cur_frm.set_df_property("website_itemgroup", "reqd",0);
        }
        if(frm.doc.variant_of){
            frm.add_custom_button(__('Remove Variant'), function(){
                frappe.call({
                    method:"eieweb.eieweb.doctype.item_as_variant.item_as_variant.item_cancel",
                    args:{
                        "doc": frm.doc.name
                    },
                    freeze:true,
                    callback: function(r){
                        if (r.message){
                            frappe.msgprint("Variant Has been Removed")
                        }
                    }
                })
        })
        }
        
    },
    show_in_website : function(frm) {
        if(frm.doc.show_in_website){
            cur_frm.set_df_property("website_itemgroup", "reqd",1);
        }
        else{
            cur_frm.set_df_property("website_itemgroup", "reqd",0);
        }
    },
});