import 'pixi';
import 'p2';
import Phaser from 'phaser';

import Unit from './unit.js';
import Map from './map.js';
import Position from './position.js';


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

    	Position.game = this.game;
	}

	preload() {
		this.map.preload();
    }

    create() {
    	// TODO: this should work
    	// this.game.camera.scale.x = 0.8;
    	// this.game.camera.scale.y = 0.8;    	


    	this.map.create();
		

		this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
    	this.game.input.mouse.capture = true;


    	this.caravel = new Unit({
    		game: this.game,
    		name: 'caravel',
    		position: new Position({
    			x: 124,
    			y: 64,
    			type: Position.TILE
    		})
    	});

    	this.caravel2 = new Unit({
    		game: this.game,
    		name: 'caravel',
    		position: new Position({
    			x: 125,
    			y: 64,
    			type: Position.TILE
    		})
    	});

    	this.map.centerMap(this.caravel.position);
    }

    update() {
    	const delta = this.game.time.physicsElapsed;
    }
}

export default Colonize;
