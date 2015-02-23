game.SwordSwing = me.Entity.extend({
	init: function(player){
		var tipX = player.pos.x + (Math.cos(player.angle)*SWORD_DISTANCE);
		var tipY = player.pos.y + (Math.sin(player.angle)*SWORD_DISTANCE);

		var settings = {};
		//settings.image = 'slingshotstone';
		settings.width = 5;
		settings.height = 5;
		settings.collisionType = 'PROJECTILE_OBJECT';
		this._super(me.Entity, 'init', [tipX, tipY, settings]);

		var line = new me.Line(
			player.pos.x,
			player.pos.y,
			[new me.Vector2d(player.pos.x, player.pos.y),
			new me.Vector2d(tipX, tipY)]
		);
		//this.body.addShape(line);
		this.body.addShape(new me.Rect(0, 0, settings.width, settings.height));
		this.body.setCollisionMask(me.collision.types.ENEMY_OBJECT);

		this.ttl = 100*4;
		this.damage = 20;

		this.player = player;

		this.player.itemAnimation = true;
		this.player.renderable.setCurrentAnimation('sword_'+this.player.facing);
		this.player.renderable.setAnimationFrame(0);
	},

	update: function(dt){
		this.body.update(dt);

		this.ttl -= dt;
		if(this.ttl <= 0){
			me.game.world.removeChild(this);
			this.player.itemAnimation = false;
		}
	}
});
