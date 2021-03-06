/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};


game.HUD.Container = me.Container.extend({

    init: function() {
        // call the constructor
        this._super(me.Container, 'init');

        // persistent across level change
        this.isPersistent = true;

        // make sure we use screen coordinates
        this.floating = true;

        // make sure our object is always draw first
        this.z = Infinity;

        // give a name
        this.name = "HUD";

        // add our child score object at the top left corner
        this.addChild(new game.HUD.CharacterHUD());
		game.text = new game.HUD.ItemTextHUD()
        this.addChild(game.text);
		game.blurb = new game.HUD.BlurbHUD()
        this.addChild(game.blurb);
    }
});


/**
 * a basic HUD item to display score
 */
game.HUD.CharacterHUD = me.Renderable.extend({
    /**
     * constructor
     */
    init: function() {
        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [0, 0, 10, 10]);

		this.font = new me.Font('arial', 16, '#ccc');
    },

    /**
     * update function
     */
    update : function () {
		// STUB
		return true;
    },

    /**
     * draw the score
     */
    draw : function (context) {
        // draw it baby !
		var text = ''

		text += 'Health: ' + me.game.player.health;
		text += '\n\n';

		text += 'Items:\n';
		game.data.items.forEach(function(item){
			text += item.name;
			if(item.button === 0){
				text += ' [LEFT]';
			}else if(item.button === 2){
				text += ' [RIGHT]';
			}
			text += '\n';
		});

		if(game.data.passiveItems.length){
			text += '\nPassive items:\n';
		}
		game.data.passiveItems.forEach(function(item){
			text += item.name + '\n';
		});

		this.font.draw(context.getContext(), text, context.getWidth() - 225, 10);
    }

});

var MESSAGE_TIME = 10000;
game.HUD.ItemTextHUD = me.Renderable.extend({
	init: function(){
		this._super(me.Renderable, 'init', [0, 0, 10, 10]);
		this.font = new me.Font('arial', 24, '#ccc');
		this.text = '';
		this.timer = 0;
	}, 

	display: function(text){
		this.text = text;
		this.timer = MESSAGE_TIME;
	},

	update: function(dt){
		if(this.timer > 0){
			this.timer -= dt;
		}
		if(this.timer <= 0){
			this.text = '';
		}

		return true;
	},

	draw: function(context){
		if(this.text){
			this.font.draw(context.getContext(), this.text, 25, 25);
		}
	}
});

game.HUD.BlurbHUD = me.Renderable.extend({
	init: function(){
		this._super(me.Renderable, 'init', [0, 0, 10, 10]);
		this.font = new me.Font('arial', 18, '#ccc');
		this.text = '';
		this.timer = 0;
	}, 

	display: function(text){
		this.text = text;
		this.timer = 500;
	},

	update: function(dt){
		if(this.timer > 0){
			this.timer -= dt;
		}
		if(this.timer <= 0){
			this.text = '';
		}

		return true;
	},

	draw: function(context){
		if(this.text){
			this.font.draw(context.getContext(), this.text, 25, 600);
		}
	}
});
