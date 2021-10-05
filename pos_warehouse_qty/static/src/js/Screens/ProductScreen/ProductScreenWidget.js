odoo.define('pos_warehouse_qty.ProductScreenWidget', function(require) {
    'use strict';

    const PosComponent = require('point_of_sale.PosComponent');
    const ProductScreen = require('point_of_sale.ProductScreen');
    const { Gui } = require('point_of_sale.Gui');
    const { useListener } = require('web.custom_hooks');
    const Registries = require('point_of_sale.Registries');
    const { useRef, useState } = owl.hooks;
    var rpc = require('web.rpc');

    const ProductScreenWidget = (ProductScreen) =>
        class extends ProductScreen {
            constructor(){
                super(...arguments);
                useListener('button-click', this._onButtonClick);
                useListener('close-warehouse-screen', this._closeWarehouse);
                useListener('show-warehouse-receipt', this._showWarehouseReceipt);
                useListener('select-line', this._changeWarehouseProduct);
                this.state.warehouse_mode = false;
                this.state.warehouseData = [];
                this.state.title = '';
            }

            _onButtonClick(){
                if(this.currentOrder.get_selected_orderline()) {
                    this.state.warehouse_mode = true;
                    this._createData();
                }
                else{
                    alert('Please Select Product.');
                }
            }

            _closeWarehouse(){
                this.state.warehouse_mode = false;
            }

            _changeWarehouseProduct(event){
                this._createData();
            }

            _createData(){
                var self = this;
                var product = this.currentOrder.get_selected_orderline().product;
                if (product) {
                    var QtyGetPromise = new Promise(function(resolve, reject){
                        rpc.query({
                            model: 'stock.warehouse',
                            method: 'display_prod_stock',
                            args: [product.id]
                        }).then(function(result){
                            if(result){
                                resolve(result);
                            }else{
                                reject()
                            }
                        });
                    });
                    QtyGetPromise.then(function(res){
                        self.state.warehouseData = res;
                        self.state.title = product.display_name;
                    });
                }
            }

            _showWarehouseReceipt(){
                this.showScreen('ReceiptScreen', {'check':'from_warehouse', 'receiptData':this.state.warehouseData, 'productName': this.state.title});
            }
        }

    Registries.Component.extend(ProductScreen, ProductScreenWidget);

    return ProductScreenWidget;

});
