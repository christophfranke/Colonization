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
import ColonyView from './view/colonyView.js';

class Colonize{

	constructor(props){
        if(typeof Colonize.instance !== 'undefined'){
            throw new Error('Colonize defined multiple times. Nobody knows what happens next...');
        }

        Colonize.instance = this;

        this.debug = true;

        this.width = 1200;
        this.height = 800;
        Colonize.game = new Phaser.Game(this.width, this.height, Phaser.AUTO, '', {
            preload: () => this.preload(),
            create: () => this.create(),
            update: () => this.update(),
            render: () => this.render()
        });

        Colonize.map = new Map();

        Colonize.fpsCounter = new FPSCounter();
        Colonize.ressources = new Ressources();
        Colonize.turn = new Turn();
    }

    preload() {
        Colonize.ressources.preload();
    }

    create() {
        // TODO: this should work
        // this.game.camera.scale.x = 0.8;
        // this.game.camera.scale.y = 0.8;      


        //create and register
        Colonize.keyboardInput = new KeyboardInput();
        Colonize.pointerInput = new PointerInput();

        Colonize.map.create();
        Colonize.fpsCounter.create();

    	this.caravel = new Unit({
    		name: 'caravel',
    		position: new Position({
    			x: 124,
    			y: 64,
    			type: Position.TILE
    		})
    	});
        this.caravel.select();

    	this.caravel2 = new Unit({
    		name: 'caravel',
    		position: new Position({
    			x: 125,
    			y: 64,
    			type: Position.TILE
    		})
    	});

        this.settler = new Unit({
            name: 'pioneer',
            position: new Position({
                x: 117,
                y: 63,
                type: Position.TILE
            })
        });

    	Colonize.map.centerAt(this.caravel.position);

        this.colonyView = new ColonyView();
    }

    update() {
    	const delta = Colonize.game.time.physicsElapsed;

        Colonize.keyboardInput.update();
    }

    render(){
        Colonize.fpsCounter.render();
    }
}

export default Colonize;
