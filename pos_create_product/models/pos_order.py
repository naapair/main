# -*- coding: utf-8 -*-
#################################################################################
#
#   Copyright (c) 2016-Present Webkul Software Pvt. Ltd. (<https://webkul.com/>)
#   See LICENSE file for full copyright and licensing details.
#   License URL : <https://store.webkul.com/license.html/>
# 
#################################################################################
from odoo import api, fields, models
import logging
_logger = logging.getLogger(__name__)
product_fields= ['display_name', 'lst_price', 'standard_price', 'categ_id', 'pos_categ_id', 'taxes_id',
                 'barcode', 'default_code', 'to_weight', 'uom_id', 'description_sale', 'description',
                 'product_tmpl_id','tracking']

class PosOrder(models.Model):
    _inherit = 'pos.order'

    @api.model
    def create_from_ui(self,orders, draft=False):
        Product = self.env['product.product']
        result = {}
        new_products = [o['data']['product_data'] for o in orders if o['data']['product_data']]
        new_product_dict = {}
        new_product_list = []        
        for product_data in new_products:                        
            for data in  product_data:                
                product_id = data['id']
                del data['id']
                if data.get('categ_id') and type(data.get('categ_id')) == list:
                    if type(data.get('categ_id')[0]) == dict:
                        data['categ_id'] = data.get('categ_id')[0].get('id') or False
                    elif type(data.get('categ_id')[0]) == int:
                        data['categ_id'] = data.get('categ_id')[0] or False
                if data.get('pos_categ_id') and type(data.get('pos_categ_id')) == list:
                    if type(data.get('pos_categ_id')[0]) == dict:
                        data['pos_categ_id'] = data.get('pos_categ_id')[0].id or False
                    elif type(data.get('pos_categ_id')[0]) == int:
                        data['pos_categ_id'] = data.get('pos_categ_id')[0] or False
                if data.get('uom_id'):
                    del data['uom_id']
                product = Product.create(data)
                new_product_dict[product_id] = product.read(product_fields)[0]
                new_product_list.append({product_id: product.read(product_fields)[0]})
        
        if new_product_dict:
            for order in orders:
                for line in order['data']['lines']:
                    temp_prod_id = line[2]['product_id']
                    if new_product_dict.get(temp_prod_id):
                        line[2]['product_id'] =  new_product_dict.get(temp_prod_id).get('id')

        order_ids = super(PosOrder,self).create_from_ui(orders,draft)

        for order_id in order_ids:
            order_id['product_details'] = new_product_list

        return order_ids