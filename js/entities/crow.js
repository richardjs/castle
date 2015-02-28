var CROW_MOVE_DISTANCE = 350;
var CROW_MOVE_SPEED = 6;
var CROW_TURN_SPEED = Math.PI*2;

game.CrowEntity = me.Entity.extend({
	'init': function(x, y, settings){
		settings.image = 'sprites';
		settings.spritewidth = 32;
		settings.spriteheight = 32;
		settings.width = 32;
		settings.height = 15;
		settings.collisiontype = 'ENEMY_OBJECT';

		this._super(me.Entity, 'init', [x, y, settings]); 

		this.state = 'rest';
		this.angle = 0;
		this.turndir = 0;

		this.health = 30;
		this.damage = 15;

		this.renderable.addAnimation('rest', [112, 113], 200);
		this.renderable.addAnimation('fly', [96, 97, 98, 97], 100);
		this.renderable.setCurrentAnimation('rest');
		this.panic = false;
	},

	'update': function(dt){
		if(this.distanceTo(me.game.player) < CROW_MOVE_DISTANCE || this.panic){
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
			this.angle += (CROW_TURN_SPEED * this.turndir)*dt/1000;

			this.body.vel.x = (Math.cos(this.angle) * CROW_MOVE_SPEED);
			this.body.vel.y = (Math.sin(this.angle) * CROW_MOVE_SPEED);

			if(this.body.vel.x > 0){
				this.renderable.flipX(true);
			}else{
				this.renderable.flipX(false);
			}
		}

		this.body.update(dt);
		me.collision.check(this);

		return this._super(me.Entity, 'update', [dt]), this.body.vel.x || this.body.vel.y;
	},

	'newDirection': function(){
		this.angle = Math.atan2(me.game.player.pos.y - this.pos.y, me.game.player.pos.x - this.pos.x)
		this.turndir = 0;
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
			do{
				this.turndir = Math.floor(Math.random()*3 - 1);
			}while(this.turndir === 0);
			setTimeout(function(){
				this.turndir = 0;
			}.bind(this), 3000 * Math.random());
			return false;
		}

		if(other.body.collisionType === me.collision.types.PLAYER_OBJECT){
			return false;
		}

		this.newDirection();

		return true;
	}
});
