game.SlingshotStoneEntity = me.Entity.extend({
	init: function(x, y, targetX, targetY, settings){
		settings = settings || {};
		settings.image = 'slingshotstone';
		settings.height = 5;
		settings.width = 5;

		this._super(me.Entity, 'init', [x, y, settings]);
		this.body.addShape(new me.Rect(0, 0, settings.width, settings.height));

		this.body.setVelocity(5, 0);
	},

	update: function(dt){
		this.body.vel.x = 3 * me.timer.tick;
		this.body.update(dt);
		me.collision.check(this);
		
		return this.body.vel.x !== 0 || this.body.vel.y !== 0;
	},

	onCollision: function(response, other){
		return false;
	}
});
