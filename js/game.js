
/* Game namespace */
var game = {

	// an object where to store game information
	data : {
		items: [],
		passiveItems: [],
		opened: {},
		armor: false,
		speed: false
	},


	// Run on page load.
	"onload" : function () {
		// Initialize the video.
		if (!me.video.init("screen",  me.video.CANVAS, 960, 640, true, 1)) {
			alert("Your browser does not support HTML5 canvas.");
			return;
		}

		// add "#debug" to the URL to enable the debug Panel
		if (document.location.hash === "#debug") {
			window.onReady(function () {
				me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
			});
		}

		// Initialize the audio.
		me.audio.init("mp3,ogg");

		// Set a callback to run when loading is complete.
		me.loader.onload = this.loaded.bind(this);

		// Load the resources.
		me.loader.preload(game.resources);

		// Initialize melonJS and display a loading screen.
		me.state.change(me.state.LOADING);
	},

	// Run on game resources loaded.
	"loaded" : function () {
		me.state.set(me.state.MENU, new game.TitleScreen());
		me.state.set(me.state.PLAY, new game.PlayScreen());

		// add our player entity in the entity pool
		me.pool.register("bat", game.BatEntity);
		me.pool.register("blurb", game.BlurbEntity);
		me.pool.register("crow", game.CrowEntity);
		me.pool.register("ghost", game.GhostEntity);
		me.pool.register("guard", game.GuardEntity);
		me.pool.register("pickup", game.PickupEntity);
		me.pool.register("player", game.PlayerEntity);
		me.pool.register("slapswing", game.SlapSwing, true);
		me.pool.register("slingshotstone", game.SlingshotStoneEntity, true);
		me.pool.register("swordswing", game.SwordSwing, true);

		// set up controls
		me.input.bindKey(me.input.KEY.W, 'up');
		me.input.bindKey(me.input.KEY.A, 'left');
		me.input.bindKey(me.input.KEY.S, 'down');
		me.input.bindKey(me.input.KEY.D, 'right');

		// disable physics gravity
		me.sys.gravity = 0;

		me.sys.preRender = false;


		// start the game
		me.state.change(me.state.PLAY);

		game.data.items.push(new Slingshot());
		game.data.items[0].equip(0);
	}
};
