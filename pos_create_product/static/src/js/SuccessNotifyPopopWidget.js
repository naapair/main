/* Copyright (c) 2016-Present Webkul Software Pvt. Ltd. (<https://webkul.com/>) */
/* See LICENSE file for full copyright and licensing details. */
/* License URL : <https://store.webkul.com/license.html/> */
odoo.define('pos_create_product.SuccessNotifyPopopWidget', function(require){
"use strict";    
    const AbstractAwaitablePopup = require('point_of_sale.AbstractAwaitablePopup');
    const Registries = require('point_of_sale.Registries');
    class SuccessNotifyPopopWidget extends AbstractAwaitablePopup {

        mounted(){
            var self = this;
            $('.order_status').show();
            $('.order_status').removeClass('creation_done');
            $('.show_tick').hide();
            setTimeout(function(){
                $('.order_status').addClass('creation_done');
                  $('.show_tick').show();
                $('.order_status').css({'border-color':'#5cb85c'})
            },500)
            setTimeout(function(){
                self.cancel();
            },1500)
        }
    
    }
    SuccessNotifyPopopWidget.template = 'SuccessNotifyPopopWidget';
    SuccessNotifyPopopWidget.defaultProps = {
        body:''
    };

    Registries.Component.add(SuccessNotifyPopopWidget);


    return SuccessNotifyPopopWidget;














    
});