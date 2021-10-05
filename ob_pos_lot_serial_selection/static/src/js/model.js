odoo.define('ob_pos_lot_serial_selection.model', function(require){
	// var screens = require('point_of_sale.screens');
	var core = require('web.core');
	// var gui = require('point_of_sale.gui');
	var models = require('point_of_sale.models');
	// var PopupWidget = require('point_of_sale.popups');
	var QWeb = core.qweb;
	const Registries = require('point_of_sale.Registries');
	const ProductScreen = require('point_of_sale.ProductScreen'); 
	const OrderWidget = require('point_of_sale.OrderWidget');
	const EditListPopup = require('point_of_sale.EditListPopup');

	models.load_models({
		model: 'stock.production.lot',
		fields: ['id','name','product_id','total_qty'],
		domain: function(self){ 
			var from = moment(new Date()).subtract(self.config.lot_expire_days,'d').format('YYYY-MM-DD')+" 00:00:00";
			if(self.config.allow_pos_lot){
				return [['create_date','>=',from],['total_qty','>',0]];
			} 
			else{
				return [['id','=',0]];
			} 
		},
		loaded: function(self,list_lot_num){
			self.list_lot_num = list_lot_num;
		},
	});

	var PacklotlineCollection2 = Backbone.Collection.extend({
		model: models.Packlotline,
		initialize: function(models, options) {
			this.order_line = options.order_line;
		},

		get_empty_model: function(){
			return this.findWhere({'lot_name': null});
		},

		remove_empty_model: function(){
			this.remove(this.where({'lot_name': null}));
		},

		get_valid_lots: function(){
			return this.filter(function(model){
				return model.get('lot_name');
			});
		},

		set_quantity_by_lot: function() {
			if (this.order_line.product.tracking == 'serial' || this.order_line.product.tracking == 'lot') {
				var valid_lots = this.get_valid_lots();
				this.order_line.set_quantity(valid_lots.length);
			}
		}
	});

	var OrderlineSuper = models.Orderline;
	models.Orderline = models.Orderline.extend({
		export_as_JSON: function() {
			var json = OrderlineSuper.prototype.export_as_JSON.apply(this,arguments);
			json.lot_details = this.get_order_line_lot();
			return json;
		},
		// set_product_lot: function(product){
		//     this.has_product_lot = product.tracking !== 'none' && this.pos.config.use_existing_lots;
		//     this.pack_lot_lines  = this.has_product_lot && new PacklotlineCollection2(null, {'order_line': this});
		// },
		export_for_printing: function(){
			var pack_lot_ids = [];
			if (this.has_product_lot){
				this.pack_lot_lines.each(_.bind( function(item) {
					return pack_lot_ids.push(item.export_as_JSON());
				}, this));
			}
			var data = OrderlineSuper.prototype.export_for_printing.apply(this, arguments);
			data.pack_lot_ids = pack_lot_ids;
			data.lot_details = this.get_order_line_lot();
			return data;
		},

		get_order_line_lot:function(){
			var pack_lot_ids = [];
			if (this.has_product_lot){
				this.pack_lot_lines.each(_.bind( function(item) {
					return pack_lot_ids.push(item.export_as_JSON());
				}, this));
			}
			return pack_lot_ids;
		},
		get_required_number_of_lots: function(){
			var lots_required = 1;

			if (this.product.tracking == 'serial' || this.product.tracking == 'lot') {
				lots_required = this.quantity;
			}
			return lots_required;
		},

	});

});