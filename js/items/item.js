var Item = Object.extend({
	'init': function(player){
		this.button = undefined;
		this.equipped = false;
		this.player = player;
	},

	'equip': function(button){
		this.button = button;
		this.equipped = true;
	},

	'unequip': function(){
		this.button = undefined;
		this.equipped = false;	
	},

	'update': function(dt){}
});
