import TerrainProps from '../data/terrain.json';
import Settings from '../data/settings.json';

import Unit from './unit.js';
import Position from './position.js';
import MapData from './mapData.js';


class Map{
	constructor(props){
		this.game = props.game;
		this.holdTimeThreshold = 350; //millis
	}

	preload(){
		this.game.load.json('mapData', '/assets/maps/test-05.json');
        this.game.load.image('mapTiles', '/assets/sprites/map.png');		
	}

	create(){
		this.mapData = new MapData({
			data: this.game.cache.getJSON('mapData')
		});
		this.numTiles = this.mapData.numTiles;
		
    	
    	this.game.load.tilemap('map', '/assets/maps/test-05.json', this.mapData.data, Phaser.Tilemap.TILED_JSON)
    	this.tilemap = this.game.add.tilemap('map');
		this.tilemap.addTilesetImage('sprites', 'mapTiles');

    	this.baseLayer = this.tilemap.createLayer('terrain base');
    	this.topLayer = this.tilemap.createLayer('terrain top');


    	//make the world big enough
    	this.baseLayer.resizeWorld();

    	this.baseLayer.inputEnabled = true;
    	this.topLayer.inputEnabled = true;

    	this.topLayer.events.onInputDown.add(this.inputDown, this);
    	this.topLayer.events.onInputUp.add(this.inputUp, this);
	}

	inputDown(){
		this.downAt = this.game.time.now;
	}

	inputUp(){
		const pointerPosition = new Position({
			x: this.game.input.activePointer.clientX,
			y: this.game.input.activePointer.clientY,
			type: Position.SCREEN
		});

		if(this.downAt !== null){		
			const downTime = this.game.time.now - this.downAt;
			this.downAt = null;

			if(downTime > this.holdTimeThreshold){
				if(Unit.selectedUnit !== null){
					Unit.selectedUnit.orderMoveTo(pointerPosition);
				}
			}
			else{
				this.centerAt(pointerPosition);
			}
		}
	}

    centerAt(clickPosition){
    	this.game.camera.position = new Phaser.Point(
    		Math.floor(clickPosition.getWorld().x - 0.5*(this.game.width / this.game.camera.scale.x)),
    		Math.floor(clickPosition.getWorld().y - 0.5*(this.game.height / this.game.camera.scale.y))
		);
    }
}

export default Map;