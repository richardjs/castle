'use strict';

var SWORD_COOLDOWN = 150;
var SWORD_DISTANCE = 0;//15;

var Sword = Item.extend({
	init: function(){
		this.name = 'Brand of the Rogue';
		this.text = 'Stolen from a noble knight, this saber was once wielded by an outlaw who infiltrated a guarded keep.';

		this._super(Item, 'init', []);
		this.cooldown = 0;
	},

	update: function(dt){
		if(this.cooldown > 0){
			this.cooldown -= dt;
		}
	},

	hold: function(event){
		if(this.cooldown <= 0){
			me.game.world.addChild(me.pool.pull('swordswing', me.game.player));
			this.cooldown = SWORD_COOLDOWN;
		}
	}
});
