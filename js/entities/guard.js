'use strict';

var GUARD_PATROL_VELOCITY = .3;
var GUARD_CHASE_VELOCITY = 1.15;

game.GuardEntity = me.Entity.extend({
	'init': function(x, y, settings){
		var width = settings.width;
		var height = settings.height;

		settings.image = 'sprites';
		settings.width = 15;
		settings.height = 27;
		settings.spritewidth = 32
		settings.spriteheight = 32;
		settings.collisionType = 'ENEMY_OBJECT';

		this._super(me.Entity, 'init', [x, y, settings]);

		// reposition hitbox to bottom of guard
		this.anchorPoint.set(.5, 1);

		if(width > height){
			this.pos.x += Math.random()*width;
			this.pos.y += height/2 - 10;
			this.axis = 'horizontal';
			this.body.setVelocity(GUARD_PATROL_VELOCITY, 0);
			this.start = x;
			this.end = x + width - 16;
		}else if(height > width){
			this.pos.x += 8;
			this.pos.y += Math.random()*height;
			this.axis = 'vertical';
			this.body.setVelocity(0, GUARD_PATROL_VELOCITY);
			this.start = y;
			this.end = y + height - 10;
		}else{
			this.pos.x += 8;
			this.pos.y += 2;
			this.axis = 'none';
		}

		if(Math.random() < .5){
			this.direction = -1;
		}else{
			this.direction = 1;
		}

		this.armor = 9;
		this.health = 35;
		this.damage = 25;

		this.state = 'patrol';

		this.renderable.addAnimation('stand_down', [144]);
		this.renderable.addAnimation('walk_down', [145, 146], 600);
		this.renderable.addAnimation('stand_up', [160]);
		this.renderable.addAnimation('walk_up', [161, 162], 600);
		this.renderable.addAnimation('stand_left', [176]);
		this.renderable.addAnimation('walk_left', [177, 178], 600);
		this.facing = 'down';
	},

	'update': function(dt){
		if(this.state === 'patrol'){
			if(this.distanceTo(me.game.player) < 100){
				this.body.setVelocity(GUARD_CHASE_VELOCITY, GUARD_CHASE_VELOCITY);
				this.state = 'chase';
			}

			if(this.axis === 'horizontal'){
				if((this.direction > 0 && this.pos.x >= this.end) || (this.direction < 0 && this.pos.x <= this.start)){
					this.direction *= -1;
				}

				this.facing = 'left';
				if(this.direction < 0){
					this.renderable.flipX(false);
				}else{
					this.renderable.flipX(true);
				}

				this.body.vel.x += this.body.accel.x * this.direction * me.timer.tick;
			}else if(this.axis === 'vertical'){
				if((this.direction > 0 && this.pos.y >= this.end) || (this.direction < 0 && this.pos.y <= this.start)){
					this.direction *= -1;
				}

				if(this.direction < 0){
					this.facing = 'up';
				}else{
					this.facing = 'down';
				}

				this.body.vel.y += this.body.accel.y * this.direction * me.timer.tick;
			}
		}else if(this.state === 'chase'){
			var angle = this.angleTo(me.game.player);
			this.body.vel.x = (Math.cos(angle) * 1);
			this.body.vel.y = (Math.sin(angle) * 1);

			if(angle > -Math.PI*.75 && angle <= -Math.PI*.25){
				this.facing = 'up';
			}else if(angle > -Math.PI*.25 && angle <= Math.PI*.25){
				this.facing = 'left';
				this.renderable.flipX(true);
			}else if(angle > Math.PI*.25 && angle <= Math.PI*.75){
				this.facing = 'down';
			}else{
				this.facing = 'left';
				this.renderable.flipX(false);
			}
		}


		if(this.body.vel.x == 0 && this.body.vel.y == 0){
			this.renderable.setCurrentAnimation('stand_' + this.facing);
		}else{
			if(!this.renderable.isCurrentAnimation('walk_' + this.facing)){
				this.renderable.setCurrentAnimation('walk_' + this.facing);
			}
		}

		this.body.update(dt);
		me.collision.check(this);

		return this._super(me.Entity, 'update', [dt]), this.body.vel.x || this.body.vel.y;
	},

	'onCollision': function(response, other){
		if(other.body.collisionType === me.collision.types.PROJECTILE_OBJECT){
			this.body.setVelocity(GUARD_CHASE_VELOCITY, GUARD_CHASE_VELOCITY);
			this.state = 'chase';

			if(other.magic){
				this.health -= other.damage, 0;
			}else{
				this.health -= Math.max(other.damage - this.armor, 0);
			}

			if(other.magic || other.damage - this.armor > 0){
				this.renderable.flicker(500);
			}

			if(this.health <= 0){
				me.game.world.removeChild(this);
			}

			return false;
		}

		return other.body.collisionType === me.collision.types.WORLD_SHAPE ||
			other.body.collisionType === me.collision.types.COLLECTABLE_OBJECT;
	}
});
