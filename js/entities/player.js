/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({

	/**
	 * constructor
	 */
	init:function (x, y, settings) {
		// set the image
		settings.image = 'player';

		// call the constructor
		this._super(me.Entity, 'init', [x, y , settings]);

		// set the viewport to follow the player
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
		me.game.viewport.setDeadzone(0, 0);

		this.body.gravity = 0;

		me.input.registerPointerEvent('pointermove', me.game.viewport, this.pointerMove.bind(this));

		// used to properly indicate the sprite has updated in this.update
		this.rotatedThisFrame = false;
	},


	/**
	 * called when the mouse moves
	 */
	pointerMove: function(eventType, region){
		// rotate to face the pointer
		this.renderable.angle = Math.atan2(
			eventType.gameY - this.pos.y,
			eventType.gameX - this.pos.x
		);
		this.rotatedThisFrame = true;
	},

	/**
	 * update the entity
	 */
	update : function (dt) {
		// apply physics to the body (this moves the entity)
		this.body.update(dt);

		// handle collisions against other shapes
		me.collision.check(this);

		var rotatedThisFrame = this.rotatedThisFrame;
		this.rotatedThisFrame = false;

		// return true if we moved or if the renderable was updated
		return (
			rotatedThisFrame
			|| this._super(me.Entity, 'update', [dt])
			|| this.body.vel.x !== 0
			|| this.body.vel.y !== 0
		);
	},

   /**
	 * colision handler
	 * (called when colliding with other objects)
	 */
	onCollision : function (response, other) {
		// Make all other objects solid
		return true;
	}
});
