var SLINGSHOT_CHARGE_TIME = 750;

var Slingshot = Item.extend({
	'init': function(player){
		this._super(Item, 'init', [player]);
		this.charge = 0;
		this.charging = false;
		this.timer = 0;
	},

	'update': function(dt){
		if(this.timer > 0){
			this.timer -= dt;
			this.player.renderable.setCurrentAnimation('slingshot_fire_' + this.player.facing);
			if(this.timer <= 0 && !this.charging){
				this.player.itemAnimation = false;
			}
		}

		if(this.charging && this.timer <= 0){	
			this.charge += dt;
			if(SLINGSHOT_CHARGE_TIME*.25 > this.charge){
				this.player.renderable.setCurrentAnimation('slingshot_low_' +  this.player.facing);
			}else if(SLINGSHOT_CHARGE_TIME*.75 > this.charge){
				this.player.renderable.setCurrentAnimation('slingshot_med_' +  this.player.facing);
			}else{
				this.player.renderable.setCurrentAnimation('slingshot_high_' +  this.player.facing);
			}

		}
	},

	'hold': function(event){
		this.charging = true;
		this.player.itemAnimation = true;
	},

	'release': function(event){
		if(this.charge > 0){
			me.game.world.addChild(me.pool.pull(
				'slingshotstone',
				this.player.pos.x,
				this.player.pos.y,
				this.player.pointerPos.x,
				this.player.pointerPos.y,
				this.charge
			));
			this.charge = 0;
			this.timer = 500;
		}
		this.charging = false;
	}
});
