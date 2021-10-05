/* Copyright (c) 2016-Present Webkul Software Pvt. Ltd. (<https://webkul.com/>) */
/* See LICENSE file for full copyright and licensing details. */
/* License URL : <https://store.webkul.com/license.html/> */
odoo.define('pos_create_product.ProductCreatePopupWidget', function(require){
"use strict";    
    const AbstractAwaitablePopup = require('point_of_sale.AbstractAwaitablePopup');
    const { useState, useRef } = owl.hooks;
    const Registries = require('point_of_sale.Registries');
    const rpc = require('web.rpc');
    var pos_model = require('point_of_sale.models');
    var model_list = pos_model.PosModel.prototype.models    
    var product_fields;

    pos_model.load_fields('account.tax',['type_tax_use']);

    for(var i = 0,len = model_list.length;i<len;i++){
        if(model_list[i].model == "product.product"){
            product_fields = model_list[i].fields;
            break;
        }
    }

    class ProductCreatePopupWidget extends AbstractAwaitablePopup {
        constructor() {
            super(...arguments);
            this.state = useState({ options: this.props });
        }
        wk_tab_select(event){
            var content_div_id ='#wk' +event.currentTarget.id
			if(content_div_id){
				$('.tab-content').removeClass('current');
				$('.tab-link').removeClass('current');
                $(event.currentTarget).addClass('current');
			    $(content_div_id).addClass('current');
			}

        }
        wk_create_and_add_product(){
            var self = this;
            var result = self.wk_create_product(true);
        }
        wk_create_product(flag){
            var self = this;
            var flag = (flag && flag==true)? true: false;
            var name = $('.info_input.name').val().trim();
            var price = $('.info_input.price').val();
            var barcode = $('.info_input.barcode').val();
            if(barcode && barcode!=''){
                self.props.barcode = barcode;
                let barcode_product = self.env.pos.db.get_product_by_barcode(barcode);
                if(barcode_product){
                    $('#main_tab').click();
                    $('.info_input.barcode').removeClass('text_shake');
                    $('.info_input.barcode').focus();
                    $('.info_input.barcode').addClass('text_shake');
                    $('.wk_barcode_exist').show();
                    setTimeout(function(){
                        $('.wk_barcode_exist').hide(); 
                    },800);
                    $('.info_input.barcode').addClass('text_shake');
                    return;
                }
            }
            if(name == ''){
                $('#main_tab').click();
                $('.info_input.name').focus(function(){
                    $('.info_input.name').removeClass('text_shake');
                });
                $('.info_input.name').addClass('text_shake');
                return;
            }
            else if(price == ""){
                $('#main_tab').click();
                $('.info_input.price').focus(function(){
                    $('.info_input.price').removeClass('text_shake');
                });
                $('.info_input.price').addClass('text_shake');
                return;
            }
            else{
                var type = $('.product_type.advance_details').val();
                var standard_price = $('.cost_price.advance_details').val() || 0;
                var categ_id = $('.categ_id.advance_details').val();
                var pos_categ_id = $('.pos_categ_id.advance_details').val();
                var categ_id = $('.categ_id.advance_details').val();
                var default_code = $('.default_code.advance_details').val();
                var taxes = $.map($('.advance_table.taxes:checked'), function(c){return parseInt(c.value); });
                var product_details={
                    'name':name,
                    'list_price':price,
                    'type':type,
                    'standard_price':standard_price,
                    'categ_id':parseInt(categ_id),
                    'pos_categ_id':parseInt(pos_categ_id),
                    'taxes_id':taxes,
                    'default_code':default_code,
                    'barcode':self.state.options.barcode,
                    'available_in_pos':true
                }
                rpc.query({
					model:'product.product',
					method:'create_product',
					args:[product_details,product_fields]
				})
                .then(function(result){
                    if(result && result.product){
                        product_details.id= result.product[0].id;
                        result = self.wk_add_product(result.product[0]);
                        if(flag && result && result!=undefined){
                            self.env.pos.get_order().add_product(result);
                        }
                    }
                    else{
                        self.showPopup('WkCPAlertPopUp', {
                            title: ('Failed To create product'),
                            body: result.error,
                        });
                    }
                })
                .catch(function(unused, event){
                    var order = self.env.pos.get_order();
                    if(!product_details.barcode || product_details.barcode !=''){
                        let product_id =  product_details.name + product_details.list_price;
                        product_details.id = product_id.replace(' ','');                    
                    }
                    else
                        product_details.id = product_details.barcode;
                    product_details.tracking = "none";
                    product_details.display_name = name;
                    product_details.lst_price = price;                  
                    if(categ_id){
                        var categ = _(self.env.pos.product_categories).filter(function(item) {
                            return item.id !== categ_id
                        });
                        if(categ)
                            product_details.categ_id = [categ[0],categ.name]
                    }
                    if(pos_categ_id){
                        let pos_categ = self.env.pos.db.category_by_id[pos_categ_id];
                        product_details.pos_categ_id = [pos_categ.id,pos_categ.name];
                    }
                    let product_uom = _.find(self.env.pos.units_by_id)
                    if(product_uom)
                        product_details.uom_id = [product_uom.id,product_uom.name];
                    if(event)
                        if(event.preventDefault)
                            event.preventDefault()
                    var result = self.wk_add_product(product_details);
                    order.product_data.push(product_details);
                    order.save_to_db();
                    if(flag && result && result!=undefined){
                        self.env.pos.get_order().add_product(result);
                    }
                });
            }
        }
        mounted() {
            var self = this;
			setTimeout(function(){
				$('.move').addClass('complete');
            },500)
            $('.info_input.price').attr('placeholder',"Amount ("+self.env.pos.currency.symbol+")")
            $('.cost_price.advance_details').attr('placeholder'," Amount ("+self.env.pos.currency.symbol+")")            
        }
        wk_add_product(product){
            var self = this;
            var product =  new pos_model.Product({}, product);
            product.pos = self.env.pos;
            self.env.pos.db.product_by_id[product.id] = product;
            self.env.pos.db.product_by_category_id[0].unshift(product.id);
            if(product.pos_categ_id && product.pos_categ_id.length){
        if(self.env.pos.db.product_by_category_id[product.pos_categ_id[0]])
                    self.env.pos.db.product_by_category_id[product.pos_categ_id[0]].unshift(product.id);
                self.env.pos.db.category_search_string[self.env.pos.db.root_category_id] += self.env.pos.db._product_search_string(product)
                self.env.pos.db.category_search_string[product.pos_categ_id[0]] += self.env.pos.db._product_search_string(product)
            }
            else
                self.env.pos.db.category_search_string[self.env.pos.db.root_category_id] += self.env.pos.db._product_search_string(product)
            if(product.barcode)
                self.env.pos.db.product_by_barcode[product.barcode] = product;
            
            self.showPopup('SuccessNotifyPopopWidget',{
            });
            return product
        }
    
    }
    ProductCreatePopupWidget.template = 'ProductCreatePopupWidget';
    ProductCreatePopupWidget.defaultProps = {
    };

    Registries.Component.add(ProductCreatePopupWidget);


    return ProductCreatePopupWidget;














    
});