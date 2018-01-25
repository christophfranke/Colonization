import 'pixi';
import 'p2';
import Phaser from 'phaser';

import Unit from './entity/unit.js';
import Map from './entity/map.js';
import Position from './helper/position.js';
import KeyboardInput from './input/keyboardInput.js';
import PointerInput from './input/pointerInput.js';
import FPSCounter from './helper/fpsCounter.js';
import Ressources from './helper/ressources.js';
import Turn from './world/turn.js';
import Colony from './entity/colony.js';

class Colonize{

	constructor(props){
        if(typeof Colonize.instance !== 'undefined'){
            throw new Error('Colonize defined multiple times. Nobody knows what happens next...');
        }

        Colonize.instance = this;

        this.debug = true;

        this.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        this.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        Colonize.game = new Phaser.Game(this.width, this.height, Phaser.CANVAS, '', {
            preload: () => this.preload(),
            create: () => this.create(),
            update: () => this.update(),
            render: () => this.render(),
            preRender: () => this.preRender()
        });
        Phaser.Canvas.setSmoothingEnabled(Colonize.game, false);

        Colonize.map = new Map();
        Colonize.fpsCounter = new FPSCounter();

        Colonize.ressources = new Ressources();
        Colonize.turn = new Turn();

        this.globals = Colonize;
    }

    preload() {
        Colonize.ressources.preload();
    }

    create() {
        // TODO: this should work
        // Colonize.game.camera.scale.x = 0.8;
        // Colonize.game.camera.scale.y = 0.8;      


        //create and register
        Colonize.keyboardInput = new KeyboardInput();
        Colonize.pointerInput = new PointerInput();

        Colonize.map.create();
        Colonize.fpsCounter.create();


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
    	const delta = Colonize.game.time.physicsElapsed;

        Colonize.keyboardInput.update();
    }

    preRender(){
        Colonize.map.mapView.renderer.preRender();
    }

    render(){
        Colonize.map.mapView.renderer.render();
        Colonize.fpsCounter.render();
    }

}

export default Colonize;
