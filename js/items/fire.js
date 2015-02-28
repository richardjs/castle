'use strict';

var FIRE_COOLDOWN = 70;

var Fire = Item.extend({
	'init': function(){
		this.name = 'Phoenix Wand';
		this.text = 'Drawn from the ashes of ages past, the tip of this wand shimmers with a crimson hue.';
		this._super(Item, 'init', []);
		this.cooldown = 0;
		this.flameo = false;
	},

	'update': function(dt){
		if(this.cooldown > 0){
			this.cooldown -= dt;
		}else{
			if(this.flameo){
				me.game.world.addChild(me.pool.pull(
					'flame',
					me.game.player.weaponOrigin.x,
					me.game.player.weaponOrigin.y,
					me.game.player.pointerPos.x,
					me.game.player.pointerPos.y
				));
				me.game.world.addChild(me.pool.pull(
					'flame',
					me.game.player.weaponOrigin.x,
					me.game.player.weaponOrigin.y,
					me.game.player.pointerPos.x,
					me.game.player.pointerPos.y,
					Math.PI/8
				));
				me.game.world.addChild(me.pool.pull(
					'flame',
					me.game.player.weaponOrigin.x,
					me.game.player.weaponOrigin.y,
					me.game.player.pointerPos.x,
					me.game.player.pointerPos.y,
					-Math.PI/8
				));
				this.cooldown = FIRE_COOLDOWN;

				if(!me.game.player.renderable.isCurrentAnimation('cast_' + me.game.player.facing)){
					me.game.player.renderable.setCurrentAnimation('cast_' +  me.game.player.facing);
				}
			}
		}
	},

	'hold': function(event){
		this.flameo = true;
		me.game.player.itemAnimation = true;
	},

	'release': function(event){
		this.flameo = false;
		me.game.player.itemAnimation = false;
	},

	'unequip': function(){
		this.flameo = false;
		this._super(Item, 'unequip', []);
	}
});
