odoo.define('ob_pos_lot_serial_selection.OrderWidgetextends', function(require){
	var core = require('web.core');
	var models = require('point_of_sale.models');
	var QWeb = core.qweb;
	const Registries = require('point_of_sale.Registries');
	const ProductScreen = require('point_of_sale.ProductScreen'); 
	const OrderWidget = require('point_of_sale.OrderWidget');
	const EditListPopup = require('point_of_sale.EditListPopup');

	const BiOrderWidget = (OrderWidget) =>
		class extends OrderWidget {
			constructor() {
				super(...arguments);
			}
			async _editPackLotLines(event) {
				const orderline = event.detail.orderline;
				const isAllowOnlyOneLot = orderline.product.isAllowOnlyOneLot();
				const packLotLinesToEdit = orderline.getPackLotLinesToEdit(isAllowOnlyOneLot);
				const { confirmed, payload } = await this.showPopup('EditListPopup1', {
					title: this.env._t('Lot/Serial Number(s) Required'),
					isSingleItem: isAllowOnlyOneLot,
					array: packLotLinesToEdit,
					product: orderline.product
				});
				if (confirmed) {
					// Segregate the old and new packlot lines
					const modifiedPackLotLines = Object.fromEntries(
						payload.newArray.filter(item => item.id).map(item => [item.id, item.text])
					);
					const newPackLotLines = payload.newArray
						.filter(item => !item.id)
						.map(item => ({ lot_name: item.text , prod_qty : item.qty}));
					orderline.setPackLotLines({ modifiedPackLotLines, newPackLotLines });
				}
				this.order.select_orderline(event.detail.orderline);
			}
		};
	Registries.Component.extend(OrderWidget, BiOrderWidget);

	return OrderWidget;
});