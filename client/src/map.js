import TerrainProps from '../data/terrain.json';
import Settings from '../data/settings.json';

import Unit from './unit.js';
import Position from './position.js';
import MapData from './mapData.js';
import Colonize from './colonize.js';


class Map{
	constructor(props){
		this.holdTimeThreshold = 350; //millis
	}

	preload(){
		Colonize.game.load.json('mapData', '/assets/maps/test-05.json');
        Colonize.game.load.image('mapTiles', '/assets/sprites/map.png');		
	}

	create(){
		this.mapData = new MapData({
			data: Colonize.game.cache.getJSON('mapData')
		});
		this.numTiles = this.mapData.numTiles;
		
    	
    	Colonize.game.load.tilemap('map', '/assets/maps/test-05.json', this.mapData.data, Phaser.Tilemap.TILED_JSON)
    	this.tilemap = Colonize.game.add.tilemap('map');
		this.tilemap.addTilesetImage('sprites', 'mapTiles');

    	this.baseLayer = this.tilemap.createLayer('terrain base');
    	this.topLayer = this.tilemap.createLayer('terrain top');

    	//make the world big enough
    	this.baseLayer.resizeWorld();
	}


    centerAt(clickPosition){
    	Colonize.game.camera.position = new Phaser.Point(
    		Math.floor(clickPosition.getWorld().x - 0.5*(Colonize.game.width / Colonize.game.camera.scale.x)),
    		Math.floor(clickPosition.getWorld().y - 0.5*(Colonize.game.height / Colonize.game.camera.scale.y))
		);
    }
}

export default Map;