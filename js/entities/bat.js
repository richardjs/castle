var BAT_MOVE_DISTANCE = 500;
var BAT_MOVE_SPEED = 75;
var BAT_TURN_SPEED = Math.PI/4;

game.BatEntity = me.Entity.extend({
	'init': function(x, y, settings){
		settings.image = 'bat';
		settings.width = 20;
		settings.height = 9;
		settings.collisiontype = 'ENEMY_OBJECT';

		this._super(me.Entity, 'init', [x, y, settings]); 

		this.state = 'rest';
		this.angle = 0;
		this.turndir = 0;

		this.health = 10;
	},

	'update': function(dt){
		if(this.distanceTo(me.game.player) < BAT_MOVE_DISTANCE){
			if(this.state !== 'move'){
				this.state = 'move';
				this.newDirection();
			}
		}else{
			this.state = 'rest';
			this.body.vel.x = 0;
			this.body.vel.y = 0;
		}

		if(this.state === 'move'){
			this.angle += (BAT_TURN_SPEED * this.turndir)*dt/1000;

			this.body.vel.x = (Math.cos(this.angle) * BAT_MOVE_SPEED)*dt/1000,
			this.body.vel.y = (Math.sin(this.angle) * BAT_MOVE_SPEED)*dt/1000
		}

		this.body.update(dt);
		me.collision.check(this);

		return this._super(me.Entity, 'update', [dt]), this.body.vel.x || this.body.vel.y;
	},

	'newDirection': function(){
		this.angle = Math.PI*2 * Math.random();
		this.turndir = Math.floor(Math.random()*3 - 1)
		console.log('new direction');
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
		}

		if(other.body.collisionType === me.collision.types.PLAYER_OBJECT){
			return false;
		}

		this.newDirection();
		return true;
	}
});
