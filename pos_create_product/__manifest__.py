# -*- coding: utf-8 -*-
#################################################################################
# Author      : Webkul Software Pvt. Ltd. (<https://webkul.com/>)
# Copyright(c): 2015-Present Webkul Software Pvt. Ltd.
# All Rights Reserved.
#
#
#
# This program is copyright property of the author mentioned above.
# You can`t redistribute it and/or modify it.
#
#
# You should have received a copy of the License along with this program.
# If not, see <https://store.webkul.com/license.html/>
#################################################################################
{
  "name"                 :  "Create Product From POS",
  "summary"              :  """POS Create Product allows to create the product on the fly by just entering the product name and the price of the product.ie. seller can create product in pos session anytime""",
  "category"             :  "Point Of Sale",
  "version"              :  "1.0.1",
  "author"               :  "Webkul Software Pvt. Ltd.",
  "license"              :  "Other proprietary",
  "website"              :  "https://store.webkul.com/Odoo-Create-Product-From-POS.html",
  "description"          :  """https://webkul.com/blog, POS Create Product, Create Product In Running Session, Create Product In POS Session, Create Product In POS, Create Barcode Product""",
  "live_test_url"        :  "http://odoodemo.webkul.com/?module=pos_create_product&custom_url=/pos/auto",
  "depends"              :  ['point_of_sale'],
  "data"                 :  [
                             'security/ir.model.access.csv',
                             'views/template.xml',
                            ],
  "qweb"                 :  ['static/src/xml/pos_create_product.xml'],
  "images"               :  ['static/description/Banner.png'],
  "application"          :  True,
  "installable"          :  True,
  "auto_install"         :  False,
  "price"                :  99,
  "currency"             :  "USD",
  "pre_init_hook"        :  "pre_init_check",
}