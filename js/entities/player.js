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

		this.facing = undefined;
		this.itemAnimation = false;

		// STUB: give player a slingshot and teleporter
		this.slingshot = new Slingshot(this);
		this.slingshot.equip(0);
		this.teleporter = new Teleporter(this);
		this.sword = new Sword(this);
		this.teleporter.equip(2);
		game.data.items.push(this.slingshot);
		game.data.items.push(this.sword);
		game.data.items.push(this.teleporter);
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
		// STUB
		this.slingshot.update(dt);
		this.teleporter.update(dt);
		this.sword.update(dt);

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
