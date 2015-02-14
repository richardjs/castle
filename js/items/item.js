var Item = Object.extend({
	'init': function(player){
		this.button = undefined;
		this.equipped = false;
		this.player = player;
	},

	'equip': function(button){
		this.button = button;
		this.equipped = true;

		me.video.renderer.getScreenCanvas().addEventListener('mousedown', this.onMouseDown.bind(this));
		me.video.renderer.getScreenCanvas().addEventListener('mouseup', this.onMouseUp.bind(this));
	},

	'unequip': function(){
		this.button = undefined;
		this.equipped = false;

		me.video.renderer.getScreenCanvas().removeEventListener('mousedown', this.onMouseDown.bind(this));
		me.video.renderer.getScreenCanvas().removeEventListener('mouseup', this.onMouseUp.bind(this));
	},

	'onMouseDown': function(event){
		event.preventDefault();
		if(event.button === this.button){
			this.hold(event);
		}
	},

	'onMouseUp': function(event){
		event.preventDefault();
		if(event.button === this.button){
			this.release(event);
		}
	},

	'update': function(dt){},
	'hold': function(dt){},
	'release': function(dt){}
});
