var Boots = Item.extend({
	init: function(){
		this.name = 'Heels of Hermes';
		this.text = 'Couriers must be swift when delivering messages from the heavens.';
		this.passive = true;
		game.data.speed = true;
	},
});
