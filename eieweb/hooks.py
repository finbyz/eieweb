# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "eieweb"
app_title = "Eieweb"
app_publisher = "Finbyz Tech Pvt Ltd"
app_description = "Website app"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "info@finbyz.com"
app_license = "GPL 3.0"


from eieweb.api import get_items as my_get_item, get_context
from erpnext.stock.doctype.item.item import Item
# import erpnext
# erpnext.portal.product_configurator.utils.get_items = my_get_item
Item.get_context = get_context
# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/eieweb/css/eieweb.css"
# app_include_js = "/assets/eieweb/js/eieweb.js"

# include js, css files in header of web template
# web_include_css = "/assets/eieweb/css/eieweb.css"
# web_include_js = "/assets/eieweb/js/eieweb.js"

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
doctype_js = {
    "Item" : "public/js/item.js"
 
 
}



# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Website user home page (by function)
# get_website_user_home_page = "eieweb.utils.get_home_page"

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "eieweb.install.before_install"
# after_install = "eieweb.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "eieweb.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"eieweb.tasks.all"
# 	],
# 	"daily": [
# 		"eieweb.tasks.daily"
# 	],
# 	"hourly": [
# 		"eieweb.tasks.hourly"
# 	],
# 	"weekly": [
# 		"eieweb.tasks.weekly"
# 	]
# 	"monthly": [
# 		"eieweb.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "eieweb.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "eieweb.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "eieweb.task.get_dashboard_data"
# }

