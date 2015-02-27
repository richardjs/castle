game.SlingshotStoneEntity = me.Entity.extend({
	init: function(x, y, targetX, targetY, charge, settings){
		settings = settings || {};
		settings.image = 'slingshotstone';
		settings.height = 5;
		settings.width = 5;
		settings.collisionType = 'PROJECTILE_OBJECT';

		this._super(me.Entity, 'init', [x - settings.width/2, y - settings.height/2, settings]);
		this.body.addShape(new me.Rect(0, 0, settings.width, settings.height));
		//this.body.setCollisionMask(me.collision.types.WORLD_SHAPE | me.collision.types.ENEMY_OBJECT);
		this.body.setCollisionMask(me.collision.types.WORLD_SHAPE | me.collision.types.ENEMY_OBJECT);

		var angle = Math.atan2(targetY - y, targetX - x);
		var speed = 500 * (Math.min(charge, 750)/750);
		this.body.accel.x = Math.cos(angle) * speed,
		this.body.accel.y = Math.sin(angle) * speed

		this.ttl = 250 + 1000*(Math.min(charge, 750)/750);
		
		this.damage = 10 * Math.min(charge, 750)/750;
	},

	update: function(dt){
		this.ttl -= dt;
		if(this.ttl <= 0){
			me.game.world.removeChild(this);
			return true;
		}

		this.body.vel.x = this.body.accel.x*dt / 1000;
		this.body.vel.y = this.body.accel.y*dt / 1000;

		this.body.update(dt);

		me.collision.check(this);
		
		return this.body.vel.x !== 0 || this.body.vel.y !== 0;
	},

	onCollision: function(response, other){
		if(other.type === 'groundOnly'){
			return false;
		}
		if(other.incorporeal){
			return false;
		}
		me.game.world.removeChild(this);
		return true;
	}
});
