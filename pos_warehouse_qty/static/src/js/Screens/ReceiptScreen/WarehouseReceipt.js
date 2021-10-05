odoo.define('pos_warehouse_qty.WarehouseReceipt', function(require) {
    'use strict';

    const PosComponent = require('point_of_sale.PosComponent');
    const Registries = require('point_of_sale.Registries');

    class WarehouseReceipt extends PosComponent {
        constructor() {
            super(...arguments);
        }
    }
    WarehouseReceipt.template = 'WarehouseReceipt';

    Registries.Component.add(WarehouseReceipt);

    return WarehouseReceipt;
});
