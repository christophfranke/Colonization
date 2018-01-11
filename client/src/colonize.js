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
		this.width = 1200;
		this.height = 800;
	    this.game = new Phaser.Game(this.width, this.height, Phaser.AUTO, '', {
	    	preload: () => this.preload(),
	    	create: () => this.create(),
	    	update: () => this.update()
	    });

	    this.map = new Map({
	    	game: this.game
	    });


        //register some globals
        Colonize.instance = this;
        Colonize.game = this.game;
        Colonize.map = this.map;
	}

	preload() {
		this.map.preload();
    }

    create() {
    	// TODO: this should work
    	// this.game.camera.scale.x = 0.8;
    	// this.game.camera.scale.y = 0.8;    	


    	this.map.create();
		

        this.keyboardInput = new KeyboardInput();
        this.pointerInput = new PointerInput();

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

    	this.map.centerAt(this.caravel.position);
    }

    update() {
    	const delta = this.game.time.physicsElapsed;

        this.keyboardInput.update();
    }
}

export default Colonize;
