frappe.ui.form.on("Item", {
    refresh: function(frm) {
        frappe.db.exists("Item",frm.doc.show_in_website).then(function(r){
            if(r){
                cur_frm.set_df_property("website_itemgroup", "reqd",1);
            }
            else{
                cur_frm.set_df_property("website_itemgroup", "reqd",0);

            }
        });
    },
    show_in_website : function(frm) {
        frappe.db.exists("Item",frm.doc.show_in_website).then(function(r){
            if(r){
                cur_frm.set_df_property("website_itemgroup", "reqd",1);
            }
            else{
                cur_frm.set_df_property("website_itemgroup", "reqd",0);

            }
        });
    },
});