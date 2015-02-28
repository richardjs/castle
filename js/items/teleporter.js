var TELEPORT_COOLDOWN = 3000;
var TELEPORT_WARMUP = 1200;

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
		this.teleporting = true;
		this.warmup = TELEPORT_WARMUP;
		this.targetX = me.game.player.pointerPos.x;
		this.targetY = me.game.player.pointerPos.y;
		me.game.player.renderable.flicker(TELEPORT_WARMUP);

		me.game.player.itemAnimation = true;
		me.game.player.renderable.setCurrentAnimation('cast_' + me.game.player.facing);
		me.game.player.renderable.setAnimationFrame(0);
	}
});
