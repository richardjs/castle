var BAT_MOVE_DISTANCE = 250;
var BAT_MOVE_SPEED = 4.5;
var BAT_TURN_SPEED = Math.PI;

game.BatEntity = me.Entity.extend({
	'init': function(x, y, settings){
		settings.image = 'sprites';
		settings.spritewidth = 32;
		settings.spriteheight = 32;
		settings.width = 17;
		settings.height = 20;
		settings.collisiontype = 'ENEMY_OBJECT';

		this._super(me.Entity, 'init', [x, y, settings]); 

		this.state = 'rest';
		this.angle = 0;
		this.turndir = 0;

		this.health = 10;
		this.damage = 10;

		this.renderable.addAnimation('rest', [80, 81, 82, 81], 200);
		this.renderable.addAnimation('fly', [64, 65, 66, 65], 100);
		this.renderable.setCurrentAnimation('rest');
		this.panic = false;
	},

	'update': function(dt){
		if(this.distanceTo(me.game.player) < BAT_MOVE_DISTANCE || this.panic){
			if(this.state !== 'move'){
				this.state = 'move';
				this.renderable.setCurrentAnimation('fly');
				this.newDirection();
			}
		}else{
			this.state = 'rest';
			this.body.vel.x = 0;
			this.body.vel.y = 0;
			if(!this.renderable.isCurrentAnimation('rest')){
				this.renderable.setCurrentAnimation('rest');
			}
		}

		if(this.state === 'move'){
			this.angle += (BAT_TURN_SPEED * this.turndir)*dt/1000;

			this.body.vel.x = (Math.cos(this.angle) * BAT_MOVE_SPEED);
			this.body.vel.y = (Math.sin(this.angle) * BAT_MOVE_SPEED);
		}

		this.body.update(dt);
		me.collision.check(this);

		return this._super(me.Entity, 'update', [dt]), this.body.vel.x || this.body.vel.y;
	},

	'newDirection': function(){
		this.angle = Math.PI*2 * Math.random();
		this.turndir = Math.floor(Math.random()*3 - 1)
	},
	
	'onCollision': function(response, other){
		if(other.type === 'groundOnly' ||
			other.body.collisionType === me.collision.types.ENEMY_OBJECT){
			return false;
		}

		if(other.damage){
			this.health -= other.damage;
			if(this.health <= 0){
				me.game.world.removeChild(this);
			}
			this.renderable.flicker(500);
			this.panic = true;
		}

		if(other.body.collisionType === me.collision.types.PLAYER_OBJECT){
			return false;
		}

		this.newDirection();
		return true;
	}
});
