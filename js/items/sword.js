'use strict';

var SWORD_COOLDOWN = 150;
var SWORD_DISTANCE = 0;//15;

var Sword = Item.extend({
	init: function(player){
		this.name = 'Sword';
		this._super(Item, 'init', [player]);
		this.cooldown = 0;
	},

	update: function(dt){
		if(this.cooldown > 0){
			this.cooldown -= dt;
		}
	},

	hold: function(event){
		if(this.cooldown <= 0){
			me.game.world.addChild(me.pool.pull('swordswing', this.player));
			this.cooldown = SWORD_COOLDOWN;
		}
	}
});
