'use strict';

game.PickupEntity = me.Entity.extend({
	init: function(x, y, settings){
		settings.image = 'tiles';
		settings.spritewidth = 32;
		settings.spriteheight = 32;
		settings.width = 25;
		settings.height = 17;
		settings.collisionType = 'COLLECTABLE_OBJECT';

		this._super(me.Entity, 'init', [x, y, settings]);

		this.anchorPoint.set(.5, 1);
		this.body.setCollisionMask(me.collision.types.PLAYER_OBJECT);

		this.renderable.addAnimation('closed', [67]);
		this.renderable.addAnimation('open', [68]);
		this.renderable.setCurrentAnimation('closed');
	},

	onCollision: function(other, response){
		this.renderable.setCurrentAnimation('open');
		return false;
	}

});
