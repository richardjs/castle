'use strict';

var SLINGSHOT_CHARGE_TIME = 750;
var SLINGSHOT_COOLDOWN = 500;

var Slingshot = Item.extend({
	'init': function(){
		this.name = 'Explorer\'s Sling';
		this.text = '';
		this._super(Item, 'init', []);
		this.charge = 0;
		this.charging = false;
		this.timer = 0;
	},

	'update': function(dt){
		if(this.timer > 0){
			this.timer -= dt;
			me.game.player.renderable.setCurrentAnimation('slingshot_fire_' + me.game.player.facing);
			if(this.timer <= 0 && !this.charging){
				me.game.player.itemAnimation = false;
			}
		}

		if(this.charging && this.timer <= 0){	
			this.charge += dt;
			if(SLINGSHOT_CHARGE_TIME*.25 > this.charge){
				me.game.player.renderable.setCurrentAnimation('slingshot_low_' +  me.game.player.facing);
			}else if(SLINGSHOT_CHARGE_TIME*.75 > this.charge){
				me.game.player.renderable.setCurrentAnimation('slingshot_med_' +  me.game.player.facing);
			}else{
				me.game.player.renderable.setCurrentAnimation('slingshot_high_' +  me.game.player.facing);
			}

		}
	},

	'hold': function(event){
		this.charging = true;
		me.game.player.itemAnimation = true;
	},

	'release': function(event){
		if(this.charge > 0){
			me.game.world.addChild(me.pool.pull(
				'slingshotstone',
				me.game.player.weaponOrigin.x,
				me.game.player.weaponOrigin.y,
				me.game.player.pointerPos.x,
				me.game.player.pointerPos.y,
				this.charge
			));
			this.charge = 0;
			this.timer = SLINGSHOT_COOLDOWN;
		}
		this.charging = false;
	}
});
