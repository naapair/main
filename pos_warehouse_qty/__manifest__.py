# -*- coding: utf-8 -*-
#################################################################################
# Author      : Acespritech Solutions Pvt. Ltd. (<www.acespritech.com>)
# Copyright(c): 2012-Present Acespritech Solutions Pvt. Ltd.
# All Rights Reserved.
#
# This program is copyright property of the author mentioned above.
# You can`t redistribute it and/or modify it.
#
#################################################################################
{
    'name': 'POS Warehouse Quantity (Community)',
    'version': '1.0.0',
    'category': 'Point of Sale',
    'summary': 'Display stock of the product from the warehouse in Point Of Sale.',
    'description': """
        Display stock of the product from the warehouse with particular warehouse locations in Point Of Sale.
    """,
    'currency': 'EUR',
    'author': "Acespritech Solutions Pvt. Ltd.",
    'website': "http://www.acespritech.com",
    'price': 25.00,
    'depends': ['point_of_sale', 'base'],
    'data': [
        'views/pos_assets.xml',
        'views/pos_config.xml',
    ],
    'images': ['static/description/mainscreen.png'],
    'qweb': [
        'static/src/xml/Screens/ProductScreen/ProductScreen.xml',
        'static/src/xml/Screens/ProductScreen/ProductsWidgetControlPanel.xml',
        'static/src/xml/Screens/ProductScreen/WarehouseScreen.xml',
        'static/src/xml/Screens/ReceiptScreen.xml',
        'static/src/xml/Screens/WarehouseReceipt.xml',
    ],
    'installable': True,
    'auto_install': False,
}
# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4: