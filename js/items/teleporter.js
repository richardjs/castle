var TELEPORT_COOLDOWN = 3000;
var TELEPORT_WARMUP = 1000;

var Teleporter = Item.extend({
	'init': function(player){
		this.name = 'Teleportation Ring';
		this._super(Item, 'init', [player]);
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
				this.player.pos.x = this.targetX;
				this.player.pos.y = this.targetY;
				this.teleporting = false;
				this.cooldown = TELEPORT_COOLDOWN;
				this.player.renderable.flicker(TELEPORT_WARMUP/2);
			}
		}
	},

	'release': function(event){
		if(this.cooldown > 0 || this.teleporting){
			return;
		}
		this.teleporting = true;
		this.warmup = TELEPORT_WARMUP;
		this.targetX = this.player.pointerPos.x;
		this.targetY = this.player.pointerPos.y;
		this.player.renderable.flicker(TELEPORT_WARMUP);
	}
});
