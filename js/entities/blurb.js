game.BlurbEntity = me.Entity.extend({
	init: function(x, y, settings){
		settings.collisionType = 'ACTION_OBJECT';
		this._super(me.Entity, 'init', [x, y, settings]);
		this.body.setCollisionMask(me.collision.types.PLAYER_OBJECT);
	},

	update: function(dt){
		me.collision.check(this);
	},

	onCollision: function(response, other){
		if(other.body.collisionType === me.collision.types.PLAYER_OBJECT){
			game.blurb.display(this.type);
		}

		return false;
	}
});
