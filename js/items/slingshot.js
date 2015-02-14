var Slingshot = Item.extend({
	'init': function(player){
		this._super(Item, 'init', [player]);
		this.charge = 0;
		this.charging = false;
		this.timer = 0;
	},

	'equip': function(button){
		this._super(Item, 'equip', [button]);
		me.video.renderer.getScreenCanvas().addEventListener('mousedown', this.onMouseDown.bind(this));
		me.video.renderer.getScreenCanvas().addEventListener('mouseup', this.onMouseUp.bind(this));
	},

	'unequip': function(){
		document.removeEventListener(this.onMouseDown);
		document.removeEventListener(this.onMouseUp);
	},

	'update': function(dt){
		if(this.timer > 0){
			this.timer -= dt;
		}

		if(this.charging && this.timer <= 0){	
			this.charge += dt;
		}
	},

	'onMouseDown': function(event){
		this.charging = true;
	},

	'onMouseUp': function(event){
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
