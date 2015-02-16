game.GuardEntity = me.Entity.extend({
	'init': function(x, y, settings){
		var width = settings.width;
		var height = settings.height;

		settings.image = 'guard';
		settings.width = 15;
		settings.height = 12;
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
			this.body.setVelocity(.5, 0);
			this.start = x;
			this.end = x + width - 16;
		}else if(height > width){
			this.pos.x += 8;
			this.pos.y += Math.random()*height;
			this.axis = 'vertical';
			this.body.setVelocity(0, .5);
			this.start = y;
			this.end = y + height - 16;
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

		this.armor = 10;
		this.health = 20;
	},

	'update': function(dt){
		if(this.axis === 'horizontal'){
			if((this.direction > 0 && this.pos.x >= this.end) || (this.direction < 0 && this.pos.x <= this.start)){
				this.direction *= -1;
			}
			this.body.vel.x += this.body.accel.x * this.direction * me.timer.tick;
		}else if(this.axis === 'vertical'){
			if((this.direction > 0 && this.pos.y >= this.end) || (this.direction < 0 && this.pos.y <= this.start)){
				this.direction *= -1;
			}
			this.body.vel.y += this.body.accel.y * this.direction * me.timer.tick;
		}
		this.body.update(dt);
		me.collision.check(this);

		return true;
	},

	'onCollision': function(response, other){
		return other.body.collisionType === me.collision.types.WORLD_SHAPE;
	}
});
