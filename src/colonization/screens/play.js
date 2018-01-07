import HUD from '../entities/HUD.js';



class PlayScreen extends window.me.ScreenObject{
    /**
     *  action to perform on state change
     */
    onResetEvent() {

        // reset the score
        this.level = new window.me.Container();
        window.me.levelDirector.loadLevel("map", {
            container: this.level
        });

        window.me.game.world.addChild(this.level);

        // Add our HUD to the game world, add it last so that this is on top of the rest.
        // Can also be forced by specifying a "Infinity" z value to the addChild function.
        this.HUD = new HUD.Container();
        window.me.game.world.addChild(this.HUD);
    }

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent() {
        // remove the HUD from the game world
        window.me.game.world.removeChild(this.HUD);
    }
}


export default PlayScreen;