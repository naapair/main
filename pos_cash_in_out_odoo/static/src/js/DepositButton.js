odoo.define('pos_cash_in_out_odoo.DepositButton', function(require) {
	"use strict";

	const PosComponent = require('point_of_sale.PosComponent');
	const ProductScreen = require('point_of_sale.ProductScreen');
	const { useListener } = require('web.custom_hooks');
	const Registries = require('point_of_sale.Registries');

	class DepositButton extends PosComponent {
		constructor() {
			super(...arguments);
			useListener('click', this.onClick);
		}
		async onClick() {
			this.showPopup('DepositPopup', {});
		}
	}
	DepositButton.template = 'DepositButton';

	ProductScreen.addControlButton({
		component: DepositButton,
		condition: function() {
			return this.env.pos.config.is_cash_in_out;
		},
	});

	Registries.Component.add(DepositButton);
	return DepositButton;

});
