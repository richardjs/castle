var Armor = Item.extend({
	init: function(){
		this.name = 'Guardian Aura';
		this.text = 'The breastplate of a forgotten hero still seeks glory.';
		this.passive = true;
		game.data.armor = true;
	},
});
