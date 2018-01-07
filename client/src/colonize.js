import 'pixi';
import 'p2';
import Phaser from 'phaser';

import Unit from './unit.js';
import Map from './map.js';


class Colonize{

	constructor(props){
		this.width = 1200;
		this.height = 800;
	    this.game = new Phaser.Game(this.width, this.height, Phaser.AUTO, '', {
	    	preload: () => this.preload(),
	    	create: () => this.create(),
	    	// update: () => this.update()
	    });

	    this.map = new Map({
	    	game: this.game
	    });
	}

	preload() {
		this.map.preload();
    }

    create() {
    	this.map.create();

    	this.game.input.mouse.capture = true;

    	this.caravel = new Unit({
    		game: this.game,
    		name: 'caravel',
    		position: {
    			x: 46,
    			y: 26
    		}
    	});

    	this.caravel2 = new Unit({
    		game: this.game,
    		name: 'caravel',
    		position: {
    			x: 46,
    			y: 27
    		}
    	});
    }

    update() {
    	const delta = this.game.time.physicsElapsed;
    }
}

export default Colonize;
