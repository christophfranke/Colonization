import TerrainProps from '../data/terrain.json';
import Settings from '../data/settings.json';

import Unit from './unit.js';


class Map{
	constructor(props){
		this.game = props.game;
		this.holdTimeThreshold = 350; //millis
	}

	preload(){
		this.game.load.tilemap('map', '/assets/maps/test-04.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('mapTiles', '/assets/sprites/map.png');		
	}

	create(){
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

	getTileAt(position){
		return {
			x: Math.floor((this.game.camera.position.x + position.x) / Settings.tileSize.x),
			y: Math.floor((this.game.camera.position.y + position.y) / Settings.tileSize.y)
		}
	}

	inputDown(e){
		this.downAt = this.game.time.now;
	}

	inputUp(e){
		if(this.downAt !== null){		
			const downTime = this.game.time.now - this.downAt;
			this.downAt = null;

			if(downTime > this.holdTimeThreshold){
				if(Unit.selectedUnit !== null){
					Unit.selectedUnit.orderMoveTo(this.getTileAt(e.input.downPoint));
				}
			}
			else{
				this.centerMap(e.input.downPoint);
			}
		}
	}

    centerMap(clickPosition){
    	this.game.camera.position = new Phaser.Point(
    		Math.floor(this.game.camera.position.x + clickPosition.x - 0.5*this.game.width),
    		Math.floor(this.game.camera.position.y + clickPosition.y - 0.5*this.game.height)
		);
    }
}

export default Map;