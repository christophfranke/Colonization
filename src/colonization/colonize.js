import TitleScreen from './screens/title.js';
import PlayScreen from './screens/play.js';
import PlayerEntity from './entities/entities.js';

var me = window.me;


class Colonize {
    constructor(props){
        this.resources = [
            {
                "name": "sprites",
                "type": "image",
                "src": "data/img/sprites.png"
            },
            {
                "name": "map",
                "type": "tmx",
                "src": "data/map/map.tmx"
            },
            {
                "name": "sprites",
                "type": "tsx",
                "src": "data/map/sprites.tsx"
            }
        ];
        
        this.data = {
            score: 0
        };
    }

    onload(){
        // Initialize the video.
        if (!me.video.init(960, 640, {wrapper : "screen", scale : "auto"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // Initialize the audio.
        me.audio.init("mp3,ogg");

        // set and load all resources.
        // (this will also automatically switch to the loading screen)
        me.loader.preload(this.resources, this.loaded);

        //export self to window (i.e. make global, ugly...)
        window.game = this;
    }

    loaded(){
        me.state.set(me.state.MENU, new TitleScreen());
        me.state.set(me.state.PLAY, new PlayScreen());

        // add our player entity in the entity pool
        me.pool.register("mainPlayer", PlayerEntity);

        // Start the game.
        me.state.change(me.state.PLAY);        
    }

    update(){
        console.log('update');
    }
}


export default Colonize;