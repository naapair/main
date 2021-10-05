odoo.define('point_of_sale.WkAlertPopUp', function(require) {
    'use strict';

    const AbstractAwaitablePopup = require('point_of_sale.AbstractAwaitablePopup');
    const Registries = require('point_of_sale.Registries');

    class WkCPAlertPopUp extends AbstractAwaitablePopup {
        getPayload() {
            return null;
        }
    }
    WkCPAlertPopUp.template = 'WkCPAlertPopUp';
    WkCPAlertPopUp.defaultProps = {
        title: 'Confirm ?',
        body: '',
    };

    Registries.Component.add(WkCPAlertPopUp);

    return WkCPAlertPopUp;


});