frappe.ui.form.on("Item", {
    refresh: function(frm) {
        if(frm.doc.show_in_website){
            cur_frm.set_df_property("website_itemgroup", "reqd",1);
        }
        else{
            cur_frm.set_df_property("website_itemgroup", "reqd",0);
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