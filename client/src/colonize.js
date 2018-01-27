import 'pixi';
import 'p2';
import Phaser from 'phaser';

import Unit from './model/entity/unit.js';
import MapController from './controller/map.js';
import Position from './utils/position.js';
import KeyboardInput from './input/keyboard.js';
import PointerInput from './input/pointer.js';
import DebugView from './view/common/debugView.js';
import Loader from './utils/loader.js';
import Turn from './model/action/turn.js';
import SpriteRenderer from 'src/render/spriteRenderer.js';
import InputContext from 'src/input/context.js';



class Colonize{

	constructor(){
        if(typeof Colonize.instance !== 'undefined'){
            throw new Error('Colonize defined multiple times. Nobody knows what happens next...');
        }

        Colonize.instance = this;

        this.debug = true;

        this.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        this.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        window.game = new Phaser.Game(this.width, this.height, Phaser.CANVAS, '', {
            preload: () => this.preload(),
            create: () => this.create(),
            update: () => this.update(),
            render: () => this.render(),
            preRender: () => this.preRender()
        });
        Phaser.Canvas.setSmoothingEnabled(game, false);

        new MapController();
        new DebugView();
        new Loader();
        new Turn();
    }

    preload() {
        Loader.instance.preload();
    }

    create() {
        // TODO: this should work
        // Colonize.game.camera.scale.x = 0.8;
        // Colonize.game.camera.scale.y = 0.8;      


        //create and register
        new KeyboardInput();
        new PointerInput();
        new InputContext({
            context: InputContext.MAP
        });

        MapController.instance.create();
        DebugView.instance.create();


        let caravel = new Unit({
    		name: 'caravel',
    		position: new Position({
    			x: 138,
    			y: 131,
    			type: Position.TILE
    		})
    	});
        caravel.select();

        new Unit({
            name: 'pioneer',
            position: new Position({
                x: 138,
                y: 131,
                type: Position.TILE
            })
        }).becomeCargo(caravel);
        
        new Unit({
            name: 'scout',
            position: new Position({
                x: 138,
                y: 131,
                type: Position.TILE
            })
        }).becomeCargo(caravel);

        new Unit({
            name: 'settler',
            position: new Position({
                x: 133,
                y: 126, 
                type: Position.TILE
            })
        }).orderFoundColony();
    }

    update() {
        KeyboardInput.instance.update();
    }

    preRender(){
        SpriteRenderer.instance.preRender();
    }

    render(){
        SpriteRenderer.instance.render();
        DebugView.instance.render();
    }

}

export default Colonize;
