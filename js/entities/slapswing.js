game.SlapSwing = me.Entity.extend({
	init: function(player){
		var settings = {};
		settings.width = 30;
		settings.height = 30;
		settings.collisionType = 'PROJECTILE_OBJECT';

		var tipX = player.weaponOrigin.x + (Math.cos(player.angle)*SLAP_DISTANCE) - settings.width/2;
		var tipY = player.weaponOrigin.y + (Math.sin(player.angle)*SLAP_DISTANCE) - settings.height/2;

		this.diffX = tipX - player.pos.x;
		this.diffY = tipY - player.pos.y;

		this._super(me.Entity, 'init', [tipX, tipY, settings]);

		this.body.addShape(new me.Rect(0, 0, settings.width, settings.height));
		this.body.setCollisionMask(me.collision.types.ENEMY_OBJECT);

		this.ttl = 50*6;
		this.damage = 100;
		this.magic = true;

		this.player = player;

		this.player.itemAnimation = true;
		this.player.renderable.setCurrentAnimation('slap_'+this.player.facing);
		this.player.renderable.setAnimationFrame(0);
	},

	update: function(dt){
		this.pos.x = this.player.pos.x + this.diffX;
		this.pos.y = this.player.pos.y + this.diffY;
		this.body.update(dt);

		this.ttl -= dt;
		if(this.ttl <= 0){
			me.game.world.removeChild(this);
			this.player.itemAnimation = false;
		}
	}
});
