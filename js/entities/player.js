'use strict';

/**
 * Player Entity
 */

var PLAYER_MAX_HEALTH = 100;
var PLAYER_INVINCIBILITY_TIME = 750;

game.PlayerEntity = me.Entity.extend({

	/**
	 * constructor
	 */
	init: function (x, y, settings) {
		// set the image
		settings.image = 'sprites';
		settings.width = 15;
		settings.height = 12;
		settings.spritewidth = 32
		settings.spriteheight = 32;
		settings.collisionType = 'PLAYER_OBJECT';

		// call the constructor
		this._super(me.Entity, 'init', [x, y , settings]);

		// store a reference to the player on me.game
		me.game.player = this;

		// reposition hitbox to bottom of player
		this.anchorPoint.set(.5, 1);

		// set player movement speed
		this.body.setVelocity(1.5, 1.5);

		// set the viewport to follow the player
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
		me.game.viewport.setDeadzone(0, 0);

		// Keep track of pointer position
		me.input.registerPointerEvent('pointermove', me.game.viewport, this.pointerMove.bind(this));
		this.pointerPos = {x: 0, y: 0};

		// Listen for keydown events for item switching
		document.body.addEventListener('keydown', this.keyDown.bind(this));

		// used to properly indicate the sprite has updated in this.update
		this.rotatedThisFrame = false;

		// set up animation
		this.renderable.addAnimation('stand_down', [0]);
		this.renderable.addAnimation('walk_down', [1, 2], 150);
		this.renderable.addAnimation('stand_up', [16]);
		this.renderable.addAnimation('walk_up', [17, 18], 150);
		this.renderable.addAnimation('stand_left', [32]);
		this.renderable.addAnimation('walk_left', [33, 34], 150);

		this.renderable.addAnimation('slingshot_low_down', [3]);
		this.renderable.addAnimation('slingshot_med_down', [4]);
		this.renderable.addAnimation('slingshot_high_down', [5]);
		this.renderable.addAnimation('slingshot_fire_down', [6]);
		this.renderable.addAnimation('slingshot_low_up', [19]);
		this.renderable.addAnimation('slingshot_med_up', [20]);
		this.renderable.addAnimation('slingshot_high_up', [21]);
		this.renderable.addAnimation('slingshot_fire_up', [22]);
		this.renderable.addAnimation('slingshot_low_left', [35]);
		this.renderable.addAnimation('slingshot_med_left', [36]);
		this.renderable.addAnimation('slingshot_high_left', [37]);
		this.renderable.addAnimation('slingshot_fire_left', [38]);

		this.renderable.addAnimation('sword_down', [51, 52, 53, 54, 54, 54], 70);
		this.renderable.addAnimation('sword_up', [67, 68, 69, 70, 70, 70], 70);
		this.renderable.addAnimation('sword_left', [83, 84, 85, 86, 86, 86], 70);

		this.renderable.addAnimation('cast_down', [99, 100, 101, 102], 150);
		this.renderable.addAnimation('cast_up', [115, 116, 117, 118], 150);
		this.renderable.addAnimation('cast_left', [131, 132, 133, 134], 150);

		this.renderable.addAnimation('slap_down', [99, 100, 101, 102, 102, 102], 25);
		this.renderable.addAnimation('slap_up', [115, 116, 117, 118, 118, 118], 25);
		this.renderable.addAnimation('slap_left', [131, 132, 133, 134, 134, 134], 25);

		this.facing = 'down';
		this.itemAnimation = false;

		this.health = PLAYER_MAX_HEALTH;
		this.spawnX = this.pos.x;
		this.spawnY = this.pos.y;

		this.invincibility = 0;
	},


	/**
	 * called when the mouse moves
	 */
	pointerMove: function(eventType, region){
		// rotate to face the pointer
		// save the pointer position
		this.pointerPos = {
			x: eventType.gameX,
			y: eventType.gameY
		};
		this.rotatedThisFrame = true;
	},

	keyDown: function(event){
		switch(event.keyCode){
			case 81: // q
				if(game.data.items.length === 2){
					var buttonA = game.data.items[0].button;
					var buttonB = game.data.items[1].button;
					game.data.items[0].unequip();
					game.data.items[1].unequip();
					game.data.items[0].equip(buttonB);
					game.data.items[1].equip(buttonA);
				}

				var equipped;
				var i;
				for(i = 0; i < game.data.items.length; i++){
					if(game.data.items[i].button === 0){
						equipped = i;
						break;
					}
				}
				for(var j = i; j < i + game.data.items.length; j++){
					var item = game.data.items[j % game.data.items.length];
					if(!item.equipped){
						game.data.items[equipped].unequip();
						item.equip(0);
					}
				}
				break;
			case 69: // e
				if(game.data.items.length === 2){
					var buttonA = game.data.items[0].button;
					var buttonB = game.data.items[1].button;
					game.data.items[0].unequip();
					game.data.items[1].unequip();
					game.data.items[0].equip(buttonB);
					game.data.items[1].equip(buttonA);
				}

				var equipped;
				var i;
				for(i = 0; i < game.data.items.length; i++){
					if(game.data.items[i].button === 2){
						equipped = i;
						break;
					}
				}
				for(var j = i; j < i + game.data.items.length; j++){
					var item = game.data.items[j % game.data.items.length];
					if(!item.equipped){
						game.data.items[equipped].unequip();
						item.equip(2);
					}
				}
				break;
		}
	},

	/**
	 * update the entity
	 */
	update : function (dt) {
		game.data.items.forEach(function(item){
			item.update(dt);
		});

		if(game.data.speed){
			this.body.setVelocity(2.25, 2.25);
		}

		// rotate the sprite to face pointer
		// TODO: we only need to do this on sprite update
		var angle = Math.atan2(
			this.pointerPos.y - this.pos.y,
			this.pointerPos.x - this.pos.x
		);
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
		this.angle = angle;

		// update weapon origin
		this.weaponOrigin = new me.Vector2d(10, 0);
		this.weaponOrigin.rotate(this.angle);
		this.weaponOrigin.x += this.pos.x + this.width/2;
		this.weaponOrigin.y += this.pos.y;

		// respond to contols
		if(me.input.isKeyPressed('left') && !me.input.isKeyPressed('right')){
			this.body.vel.x -= this.body.accel.x * me.timer.tick;
		}else if(me.input.isKeyPressed('right') && !me.input.isKeyPressed('left')){
			this.body.vel.x += this.body.accel.x * me.timer.tick;
		}else{
			this.body.vel.x = 0;
		}
		if(me.input.isKeyPressed('up') && !me.input.isKeyPressed('down')){
			this.body.vel.y -= this.body.accel.y * me.timer.tick;
		}else if(me.input.isKeyPressed('down') && !me.input.isKeyPressed('up')){
			this.body.vel.y += this.body.accel.y * me.timer.tick;
		}else{
			this.body.vel.y = 0;
		}

		if(!this.itemAnimation){
			if(this.body.vel.x == 0 && this.body.vel.y == 0){
				this.renderable.setCurrentAnimation('stand_' + this.facing);
			}else{
				if(!this.renderable.isCurrentAnimation('walk_' + this.facing)){
					this.renderable.setCurrentAnimation('walk_' + this.facing);
				}
			}
		}

		// apply physics to the body (this moves the entity)
		this.body.update(dt);

		// handle collisions against other shapes
		me.collision.check(this);

		var rotatedThisFrame = this.rotatedThisFrame;
		this.rotatedThisFrame = false;

		if(this.invincibility > 0){
			this.invincibility -= dt;
		}

		// return true if we moved or if the renderable was updated
		return (
			this._super(me.Entity, 'update', [dt])
			|| rotatedThisFrame
			|| this.body.vel.x !== 0
			|| this.body.vel.y !== 0
			|| this.itemAnimation
		);
	},

   /**
	 * colision handler
	 * (called when colliding with other objects)
	 */
	onCollision : function (response, other) {
		// Make all other objects solid
		if(other.body.collisionType === me.collision.types.PROJECTILE_OBJECT
				|| other.body.collisionType === me.collision.types.ACTION_OBJECT){
			return false;
		}
		if(other.body.collisionType === me.collision.types.ENEMY_OBJECT){
			if(this.invincibility > 0){
				return false;
			}

			if(other.damage){
				if(game.data.armor){
					this.health -= Math.ceil(other.damage/2);
				}else{
					this.health -= other.damage;
				}
				if(this.health <= 0){
					this.pos.x = this.spawnX;
					this.pos.y = this.spawnY;
					this.health = PLAYER_MAX_HEALTH;

					this.renderable.flicker(3000);
					me.state.change(me.state.PLAY);
				}
			}

			this.renderable.flicker(PLAYER_INVINCIBILITY_TIME);
			this.invincibility = PLAYER_INVINCIBILITY_TIME;

			return false;
		}

		if(other.blurb){
			return false;
		}
		return true;
	}
});
