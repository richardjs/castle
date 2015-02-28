var TELEPORT_COOLDOWN = 3000;
var TELEPORT_WARMUP = 1200;

var TeleportTester = me.Entity.extend({
	init: function(x1, y1, x2, y2){
		var settings = {};
		settings.width = 5;
		settings.height = 5;
		this._super(me.Entity, 'init', [x1, y1, settings]);

		this.body.setCollisionMask(me.collision.types.WORLD_SHAPE);

		this.body.addShape(new me.Rect(0, 0, settings.width, settings.height));

		var distx = x2 - x1;
		var disty = y2 - y1;
		var angle = Math.atan2(disty, distx);
		var distance = Math.sqrt(
			Math.pow(distx, 2) + Math.pow(disty, 2)
		);
		var dx = Math.cos(angle) * 1;
		var dy = Math.sin(angle) * 1;
		
		this.body.vel.x = dx;
		this.body.vel.y = dy;

		for(var i = 0; i < distance; i++){
			this.body.update(1);
			me.collision.check(this);
			if(this.failed){
				break;
			}
		}
	},

	onCollision: function(response, other){
		if(other.body.collisionType === me.collision.types.WORLD_SHAPE){
			if(other.type !== 'groundOnly'){
				this.failed = true;
			}
		}
	}
});

var Teleporter = Item.extend({
	'init': function(){
		this.name = 'Mirror of Escape';
		this.text = 'Even pits pose no problems when fleeing from your enemies.';
		this._super(Item, 'init', []);
		this.cooldown = 0;
		this.warmup = 0;
		this.teleporting = false;
		this.targetX = undefined;
		this.targetY = undefined;
	},

	'update': function(dt){
		if(this.cooldown > 0){
			this.cooldown -= dt;
		}

		if(this.teleporting){
			this.warmup -= dt;

			if(this.warmup <= 0){
				me.game.player.pos.x = this.targetX;
				me.game.player.pos.y = this.targetY;
				this.teleporting = false;
				this.cooldown = TELEPORT_COOLDOWN;
				me.game.player.renderable.flicker(TELEPORT_WARMUP/2);
				me.game.player.itemAnimation = false;
			}
		}
	},

	'hold': function(event){
		if(this.cooldown > 0 || this.teleporting){
			return;
		}

		this.targetX = me.game.player.pointerPos.x;
		this.targetY = me.game.player.pointerPos.y;

		var tester = new TeleportTester(
			me.game.player.pos.x,
			me.game.player.pos.y,
			this.targetX,
			this.targetY
		);
		if(tester.failed){
			return;
		}

		this.teleporting = true;
		this.warmup = TELEPORT_WARMUP;
		me.game.player.renderable.flicker(TELEPORT_WARMUP);

		me.game.player.itemAnimation = true;
		me.game.player.renderable.setCurrentAnimation('cast_' + me.game.player.facing);
		me.game.player.renderable.setAnimationFrame(0);
	}
});
