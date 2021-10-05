odoo.define('pos_multi_image.pos_multi_image', function (require) {
"use strict";

    const models = require('point_of_sale.models');
    const ProductItem = require('point_of_sale.ProductItem');
    const Registries = require('point_of_sale.Registries');
    const AbstractAwaitablePopup = require('point_of_sale.AbstractAwaitablePopup');


    models.load_fields("product.product",['product_multi_img_id']);

    const PosProductItem = (ProductItem) =>
        class extends ProductItem {
            product_review(product_id,event) {
                var product = this.env.pos.db.get_product_by_id(product_id);
                this.showPopup('MultiImgPopupWidget', {
                    product: product,
                });
                event.preventDefault();
                event.stopPropagation();
            }
        }

    Registries.Component.extend(ProductItem, PosProductItem);
    
    class MultiImgPopupWidget extends AbstractAwaitablePopup {
        constructor() {
            super(...arguments);
            setTimeout(function(){
                $('.bxslider').bxSlider({
                    auto: false,
                    autoControls: true,
                    stopAutoOnClick: true,
                    pager: false,
                    slideWidth: 1360,
                });
            }, 30);


        }
        add_to_cart_button(){
            var order = this.env.pos.get_order();
            order.add_product(this.props.product);
            this.cancel()
        }
    }
    MultiImgPopupWidget.template = 'MultiImgPopupWidget';


    Registries.Component.add(MultiImgPopupWidget);
});
