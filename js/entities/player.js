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

		this.body.gravity = 0;
	},

	/**
	 * update the entity
	 */
	update : function (dt) {

		// apply physics to the body (this moves the entity)
		this.body.update(dt);

		// handle collisions against other shapes
		me.collision.check(this);

		// return true if we moved or if the renderable was updated
		return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
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
