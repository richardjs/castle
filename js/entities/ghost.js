'use strict';

var GHOST_ACTIVATION_DISTANCE = 100;

var GHOST_MOVE_SPEED = 1.3;

var GHOST_FADE_DISTANCE = 250;
var GHOST_MAX_FADE = 1;
var GHOST_MIN_FADE = .05;

var GHOST_TELEPORT_DISTANCE = 275;

game.GhostEntity = me.Entity.extend({
	'init': function(x, y, settings){
		settings.image = 'sprites';
		settings.spritewidth = 32;
		settings.spriteheight = 32;
		settings.width = 32;
		settings.height = 32;
		settings.collisiontype = 'ENEMY_OBJECT';

		this._super(me.Entity, 'init', [x, y, settings]); 

		this.health = 20;
		this.damage = 40;
		this.incorporeal = true;

		this.renderable.addAnimation('float', [128, 129], 500);
		this.renderable.setCurrentAnimation('float');
		this.renderable.setOpacity(GHOST_MIN_FADE);

		this.angle = Math.atan2(me.game.player.pos.y - this.pos.y, me.game.player.pos.x - this.pos.x)

		this.state = 'idle';
	},

	'update': function(dt){
		this.body.update(dt);
		me.collision.check(this);

		var playerDistance = this.distanceTo(me.game.player);

		if(this.state == 'idle'){
			if(playerDistance < GHOST_ACTIVATION_DISTANCE){
				this.state = 'active';
			}else{
				return false;
			}
		}

		if(playerDistance < GHOST_FADE_DISTANCE){
			var fadeFactor = playerDistance / GHOST_FADE_DISTANCE;
			var fadeSpan = GHOST_MAX_FADE - GHOST_MIN_FADE;
			this.renderable.setOpacity(GHOST_MAX_FADE - fadeFactor*fadeSpan);
		}else{
			this.renderable.setOpacity(GHOST_MIN_FADE);
		}

		if(me.game.player.pos.x > this.pos.x){
			this.renderable.flipX(true);
		}else{
			this.renderable.flipX(false);
		}

		this.angle = Math.atan2(me.game.player.pos.y - this.pos.y, me.game.player.pos.x - this.pos.x)
		this.body.vel.x = (Math.cos(this.angle) * GHOST_MOVE_SPEED);
		this.body.vel.y = (Math.sin(this.angle) * GHOST_MOVE_SPEED);

		return this._super(me.Entity, 'update', [dt]), this.body.vel.x || this.body.vel.y;
	},

	'onCollision': function(response, other){
		if(other.body.collisionType === me.collision.types.WORLD_SHAPE ||
			other.body.collisionType === me.collision.types.ENEMY_OBJECT){
			return false;
		}

		if(other.damage){
			if(!other.magic){
				return false;
			}
			this.health -= other.damage;
			if(this.health <= 0){
				me.game.world.removeChild(this);
			}
			this.renderable.flicker(500);
			return false;
		}

		if(other.body.collisionType === me.collision.types.PLAYER_OBJECT){
			var vector = new me.Vector2d(GHOST_TELEPORT_DISTANCE);
			vector.rotate(Math.random() * 2*Math.PI);
			this.pos.x += vector.x;
			this.pos.y += vector.y;
			return false;
		}

		return true;
	}
});
