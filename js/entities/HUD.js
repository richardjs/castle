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
        this.addChild(new game.HUD.ItemHUD());
    }
});


/**
 * a basic HUD item to display score
 */
game.HUD.ItemHUD = me.Renderable.extend({
    /**
     * constructor
     */
    init: function() {
        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [0, 0, 10, 10]);

		this.font = new me.Font('arial', 14, '#ccc');
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
				text += ' [L]';
			}else if(item.button === 2){
				text += ' [R]';
			}
			text += '\n';
		});
		this.font.draw(context.getContext(), text, context.getWidth() - 150, 10);
    }

});
