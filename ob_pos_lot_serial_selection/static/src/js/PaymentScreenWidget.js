odoo.define('ob_pos_lot_serial_selection.PaymentScreenWidget', function(require){
	'use strict';

	const PaymentScreen = require('point_of_sale.PaymentScreen');
	const PosComponent = require('point_of_sale.PosComponent');
	const Registries = require('point_of_sale.Registries');
	const { Component } = owl;

	const PaymentScreenWidget = (PaymentScreen) =>
		class extends PaymentScreen {
			constructor() {
				super(...arguments);
			}

			async validateOrder(isForceValidate) {
				var self = this;
				var order = this.env.pos.get_order();
				var orderline = order.get_orderlines();
				var lot_list = this.env.pos.list_lot_num;
				orderline.forEach(function(line) {
					if(line.pack_lot_lines && line.pack_lot_lines.models.length > 0){
						line.pack_lot_lines.models.forEach(function(lot){
							lot_list.forEach(function(d_lot){
								if(line.product.id == d_lot.product_id[0] && d_lot.name == lot.attributes.lot_name){
									d_lot.total_qty = d_lot.total_qty - 1
								}
							});
						});
					}
				});
				super.validateOrder(isForceValidate);
			}	
	};

	Registries.Component.extend(PaymentScreen, PaymentScreenWidget);

	return PaymentScreen;

});