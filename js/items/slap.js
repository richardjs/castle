'use strict';

var SLAP_DISTANCE = -5;

var Slap = Item.extend({
	init: function(){
		this.name = 'Slap Hand';
		this.text = '';

		this._super(Item, 'init', []);
	},

	hold: function(event){
		me.game.world.addChild(me.pool.pull('slapswing', me.game.player));
	}
});
