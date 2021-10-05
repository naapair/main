/* Copyright (c) 2016-Present Webkul Software Pvt. Ltd. (<https://webkul.com/>) */
/* See LICENSE file for full copyright and licensing details. */
/* License URL : <https://store.webkul.com/license.html/> */
odoo.define('pos_create_product.pos_create_product', function(require){
"use strict";
    var core = require('web.core');
    var Chrome = require('point_of_sale.Chrome');
    var QWeb = core.qweb;
    var pos_model = require('point_of_sale.models');
    var rpc = require('web.rpc')    
    var SuperOrder = pos_model.Order;    
    var SuperPosModel = pos_model.PosModel.prototype;
    var ProductScreen = require('point_of_sale.ProductScreen');
    const Registries = require('point_of_sale.Registries');


    var PosResChrome = Chrome =>
        class extends Chrome {
			create_new_product(){

                var self = this;
                this.showPopup('ProductCreatePopupWidget',{});
			}
		}

    Registries.Component.extend(Chrome, PosResChrome);

    Registries.Component.freeze();
    
    var PosResProductScreen = ProductScreen =>
        class extends ProductScreen {
            _barcodeErrorAction(code) {
                this.showPopup('ErrorBarcodePopup', { code: this._codeRepr(code) ,message:'The Point of Sale could not find any product associated with the scanned barcode. Please create a new product associatedto this barcode'});
        }
    }

    Registries.Component.extend(ProductScreen, PosResProductScreen);

    Registries.Component.freeze();
    

    pos_model.Order = pos_model.Order.extend({
        initialize: function(attributes,options){
            var self = this;
            self.product_data=[];            
            SuperOrder.prototype.initialize.call(this,attributes,options);
        },

        init_from_JSON: function(json) {
            var self = this;
            if (json.product_data && json.product_data.length){
                this.product_data = json.product_data;
                self.wk_add_product(json.product_data);
                self.product_data = json.product_data;  
            }
            SuperOrder.prototype.init_from_JSON.call(this,json);
        },

        wk_add_product: function(product_data){
            var self = this;
            product_data.forEach(element => {
                var product =  new pos_model.Product({}, element);            
                self.pos.db.product_by_id[product.id] = product;
                if(product.barcode)
                    self.pos.db.product_by_barcode[product.barcode] = product;                    
            });
        },
        
		export_as_JSON: function() {
			var self = this;
			var loaded=SuperOrder.prototype.export_as_JSON.call(this);
			loaded.product_data=self.product_data;  
			return loaded;
		},
    });
    
    pos_model.PosModel = pos_model.PosModel.extend({
        _save_to_server: function (orders, options) {
            var self = this;
            return SuperPosModel._save_to_server.call(this,orders,options).then(function(return_dict){
                if(return_dict){
                    _.forEach(return_dict, function(data){
                        if(data.product_details != null){
                        var product_details = data.product_details ;
                        product_details.forEach(element => {                        
                            for (var key in element){
                                let product = element[key];
                                delete self.db.product_by_id[key]
                                product =  new pos_model.Product({}, product);
                                self.db.product_by_id[product.id] = product;
                                self.db.product_by_category_id[0].unshift(product.id);
                                self.db.product_by_category_id[0] = self.db.product_by_category_id[0].filter(function(item) { 
                                    return item !== key
                                });
                                if(product.pos_categ_id && product.pos_categ_id.length){
                                    if(self.pos.db.product_by_category_id[product.pos_categ_id[0]])
                                        self.db.product_by_category_id[product.pos_categ_id[0]].unshift(product.id)
                                        self.db.product_by_category_id[product.pos_categ_id[0]] = self.db.product_by_category_id[product.pos_categ_id[0]].filter(function(item) { 
                                            return item !== key
                                        });
                                }
                                self.db.product_by_barcode[product.barcode] = product;
                            }
                        });
                        if(self.chrome && self.chrome.screens && self.chrome.screens.products && self.chrome.screens.products.product_categories_widget )
                            self.chrome.screens.products.product_categories_widget.renderElement()
                        }
                    });
                }
                return return_dict
            });
        }
    });

});