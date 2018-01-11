import 'pixi';
import 'p2';
import Phaser from 'phaser';

import Unit from './unit.js';
import Map from './map.js';
import Position from './position.js';
import KeyboardInput from './keyboardInput.js';
import PointerInput from './pointerInput.js';


class Colonize{

	constructor(props){
        if(typeof Colonize.instance !== 'undefined'){
            throw new Error('Colonize defined multiple times. Nobody knows what happens next...');
        }

        Colonize.instance = this;


        this.width = 1200;
        this.height = 800;
        Colonize.game = new Phaser.Game(this.width, this.height, Phaser.AUTO, '', {
            preload: () => this.preload(),
            create: () => this.create(),
            update: () => this.update()
        });

        Colonize.map = new Map({
            jsonURL: '/assets/maps/test-05.json',
            pngURL: '/assets/sprites/map.png'
        });
	}

	preload() {
		Colonize.map.preload();
    }

    create() {
    	// TODO: this should work
    	// this.game.camera.scale.x = 0.8;
    	// this.game.camera.scale.y = 0.8;    	


    	Colonize.map.create();

        //create and register
        Colonize.keyboardInput = new KeyboardInput();
        Colonize.pointerInput = new PointerInput();

    	this.caravel = new Unit({
    		name: 'caravel',
    		position: new Position({
    			x: 124,
    			y: 64,
    			type: Position.TILE
    		})
    	});

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
    }

    update() {
    	const delta = Colonize.game.time.physicsElapsed;

        Colonize.keyboardInput.update();
    }
}

export default Colonize;
