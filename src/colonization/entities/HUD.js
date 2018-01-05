/**
 * a HUD container and child items
 */


var HUD = {};

HUD.Container = window.me.Container.extend({

    init: function() {
        // call the constructor
        this._super(window.me.Container, 'init');

        // persistent across level change
        this.isPersistent = true;

        // make sure we use screen coordinates
        this.floating = true;

        // give a name
        this.name = "HUD";

        // add our child score object at the top left corner
        this.addChild(new HUD.ScoreItem(5, 5));
    },
});


/**
 * a basic HUD item to display score
 */
HUD.ScoreItem = window.me.Renderable.extend({
    /**
     * constructor
     */
    init: function(x, y) {

        // call the parent constructor
        // (size does not matter here)
        this._super(window.me.Renderable, 'init', [x, y, 10, 10]);

        // local copy of the global score
        this.score = -1;
    },

    /**
     * update function
     */
    update : function () {
        // we don't do anything fancy here, so just
        // return true if the score has been updated
        if (this.score !== window.game.data.score) {
            this.score = window.game.data.score;
            return true;
        }
        return false;
    },

    /**
     * draw the score
     */
    draw : function (context) {
        // draw it baby !
    }

});

export default HUD;