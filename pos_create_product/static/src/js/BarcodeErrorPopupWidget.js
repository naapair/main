/* Copyright (c) 2016-Present Webkul Software Pvt. Ltd. (<https://webkul.com/>) */
/* See LICENSE file for full copyright and licensing details. */
/* License URL : <https://store.webkul.com/license.html/> */
odoo.define('pos_create_product.PosResBarcodeErrorPopUp', function(require){
"use strict";    
    const Registries = require('point_of_sale.Registries');
    const ErrorBarcodePopup = require('point_of_sale.ErrorBarcodePopup');


    var PosResBarcodeErrorPopUp = ErrorBarcodePopup =>
        class extends ErrorBarcodePopup {
			create_new_product(){
                this.showPopup('ProductCreatePopupWidget',{
                    code:this.props.code
                })
            }
        }


    Registries.Component.extend(ErrorBarcodePopup, PosResBarcodeErrorPopUp);

	Registries.Component.freeze();














    
});