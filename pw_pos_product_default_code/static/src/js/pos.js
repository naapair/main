odoo.define('pos_default_code.pos_default_code', function (require) {
    "use strict";
    var models = require('point_of_sale.models');

    var _super_orderline = models.Orderline.prototype;
    models.Orderline = models.Orderline.extend({
        generate_wrapped_product_name: function() {
        	var name = _super_orderline.generate_wrapped_product_name.call(this);
        	if (this.get_product().default_code) {
        		name[0] = '['+this.get_product().default_code + '] ' + name[0]
        	}
        	return name
        },
    });
});
