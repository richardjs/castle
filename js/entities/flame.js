'use strict';

game.FlameEntity = me.Entity.extend({
	init: function(x, y, targetX, targetY, anglemod, settings){
		settings = settings || {};
		settings.image = 'sprites';
		settings.spritewidth = 32;
		settings.spriteheight = 32;
		settings.height = 10;
		settings.width = 15;
		settings.collisionType = 'PROJECTILE_OBJECT';

		this._super(me.Entity, 'init', [x - settings.width/2, y - settings.height/2, settings]);
		this.body.addShape(new me.Rect(0, 0, settings.width, settings.height));
		this.body.setCollisionMask(me.collision.types.WORLD_SHAPE | me.collision.types.ENEMY_OBJECT);

		this.anchorPoint.set(.5, .75);

		var angle = Math.atan2(targetY - y, targetX - x);
		if(anglemod){
			angle += anglemod;
		}
		var speed = 500;
		this.body.accel.x = Math.cos(angle) * speed,
		this.body.accel.y = Math.sin(angle) * speed

		this.ttl = 350;
		
		this.damage = 3;
		this.magic = true;

		this.renderable.addAnimation('flame', [147, 148, 149, 148], 25);
		this.renderable.setCurrentAnimation('flame');
		this.renderable.setAnimationFrame(Math.floor(Math.random() * 3));
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
		
		return this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0;
	},

	onCollision: function(response, other){
		if(other.type === 'groundOnly'){
			return false;
		}
		me.game.world.removeChild(this);
		return true;
	}
});
