# -*- coding: utf-8 -*-
#################################################################################
#
#   Copyright (c) 2016-Present Webkul Software Pvt. Ltd. (<https://webkul.com/>)
#   See LICENSE file for full copyright and licensing details.
#   License URL : <https://store.webkul.com/license.html/>
# 
#################################################################################
from odoo import api, fields, models
class ProductProduct(models.Model):
    _inherit = 'product.product'

    @api.model
    def create_product(self,vals,product_fields):
        try:            
            product = self.create(vals)
            self._cr.commit()
            if product and len(vals.get('taxes_id')):
                product.write({'taxes_id':[(6,0,vals.get('taxes_id'))]})
            return {'product' :product.read(product_fields)}
        except Exception as e:
            return {'error':e}

