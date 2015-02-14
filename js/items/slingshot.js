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
		}

		if(this.charging && this.timer <= 0){	
			this.charge += dt;
		}
	},

	'hold': function(event){
		this.charging = true;
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
