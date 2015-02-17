/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({

	/**
	 * constructor
	 */
	init: function (x, y, settings) {
		// set the image
		settings.image = 'character';
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

		// used to properly indicate the sprite has updated in this.update
		this.rotatedThisFrame = false;

		// set up animation
		this.renderable.addAnimation('stand_down', [0]);
		this.renderable.addAnimation('walk_down', [0, 1, 0, 2], 150);
		this.renderable.addAnimation('stand_up', [7]);
		this.renderable.addAnimation('walk_up', [7, 8, 7, 9], 150);
		this.renderable.addAnimation('stand_left', [14]);
		this.renderable.addAnimation('walk_left', [14, 15, 14, 16], 150);

		this.renderable.addAnimation('slingshot_low_down', [3]);
		this.renderable.addAnimation('slingshot_med_down', [4]);
		this.renderable.addAnimation('slingshot_high_down', [5]);
		this.renderable.addAnimation('slingshot_fire_down', [6]);
		this.renderable.addAnimation('slingshot_low_up', [10]);
		this.renderable.addAnimation('slingshot_med_up', [11]);
		this.renderable.addAnimation('slingshot_high_up', [12]);
		this.renderable.addAnimation('slingshot_fire_up', [13]);
		this.renderable.addAnimation('slingshot_low_left', [17]);
		this.renderable.addAnimation('slingshot_med_left', [18]);
		this.renderable.addAnimation('slingshot_high_left', [19]);
		this.renderable.addAnimation('slingshot_fire_left', [20]);
		this.facing = undefined;
		this.itemAnimation = false;

		// STUB: give player a slingshot and teleporter
		this.slingshot = new Slingshot(this);
		this.slingshot.equip(0);
		this.teleporter = new Teleporter(this);
		this.teleporter.equip(2);
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

	/**
	 * update the entity
	 */
	update : function (dt) {
		// STUB
		this.slingshot.update(dt);
		this.teleporter.update(dt);

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

		/*
		document.body.getElementsByTagName('canvas')[0].addEventListener('mouseup', function(){
			me.game.world.addChild(me.pool.pull('slingshotstone', this.pos.x, this.pos.y, 0, 0));
		}.bind(this));
		*/

		// apply physics to the body (this moves the entity)
		this.body.update(dt);

		// handle collisions against other shapes
		me.collision.check(this);

		var rotatedThisFrame = this.rotatedThisFrame;
		this.rotatedThisFrame = false;

		// return true if we moved or if the renderable was updated
		return (
			rotatedThisFrame
			|| this._super(me.Entity, 'update', [dt])
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
		if(other.body.collisitionType === me.collision.types.PROJECTILE_OBJECT){
			return false;
		}
		if(other.body.collisionType === me.collision.types.ENEMY_OBJECT){
			this.renderable.flicker(500);
			return false;
		}
		return true;
	}
});
