import TerrainProps from '../data/terrain.json';
import Settings from '../data/settings.json';

import Unit from './unit.js';
import Position from './position.js';
import MapData from './mapData.js';
import Colonize from './colonize.js';


class Map{
	constructor(props){
		this.holdTimeThreshold = 350; //millis
		this.mapCenterTweenTime = 250; //also millis
		
		this.jsonURL = props.jsonURL;
		this.pngURL = props.pngURL;
	}

	preload(){
		Colonize.game.load.json('mapData', this.jsonURL);
        Colonize.game.load.image('mapTiles', this.pngURL);		
	}

	create(){
		this.mapData = new MapData({
			data: Colonize.game.cache.getJSON('mapData')
		});


		this.numTiles = this.mapData.numTiles;
		
    	
    	Colonize.game.load.tilemap('map', '/assets/maps/test-05.json', this.mapData.data, Phaser.Tilemap.TILED_JSON)
    	this.tilemap = Colonize.game.add.tilemap('map');
		this.tilemap.addTilesetImage(this.mapData.getTilesetName(), 'mapTiles');

    	this.baseLayer = this.tilemap.createLayer('terrain base');
		this.blendleftLayer = this.tilemap.createLayer('terrain blend left');
		this.blenddownLayer = this.tilemap.createLayer('terrain blend down');
		this.blendrightLayer = this.tilemap.createLayer('terrain blend right');
		this.blendtopLayer = this.tilemap.createLayer('terrain blend top');
		this.blendcoastLayer = this.tilemap.createLayer('terrain blend coast');
		this.blendcoast2Layer = this.tilemap.createLayer('terrain blend coast 2');
    	this.topLayer = this.tilemap.createLayer('terrain top');

    	//make the world big enough
    	this.baseLayer.resizeWorld();
	}


    centerAt(clickPosition){
		const cameraTarget = {
			x: Math.floor(clickPosition.getWorld().x - 0.5*(Colonize.game.width / Colonize.game.camera.scale.x)),
			y: Math.floor(clickPosition.getWorld().y - 0.5*(Colonize.game.height / Colonize.game.camera.scale.y))
		};

		Colonize.game.add.tween(Colonize.game.camera).to( {
				x: cameraTarget.x,
				y: cameraTarget.y
			},
			this.mapCenterTweenTime,
			Phaser.Easing.Cubic.InOut,
			true,
			0,
			0,
			false
		);
    }
}

export default Map;