
import Colonize from '../colonize.js';
import MapSettings from '../../data/map.json';
import Settings from '../../data/settings.json';
import Terrain from '../../data/terrain.json';

import Position from '../helper/position.js';


class MapView{

	constructor(props){
		this.mapData = props.mapData;

		//create layers
		let rawMap = MapSettings;
		rawMap.layers = [];
		rawMap.layers[0] = this.createEmptyLayer("terrain base");
		rawMap.layers[1] = this.createEmptyLayer("terrain blend left");
		rawMap.layers[2] = this.createEmptyLayer("terrain blend top");
		rawMap.layers[3] = this.createEmptyLayer("terrain blend right");
		rawMap.layers[4] = this.createEmptyLayer("terrain blend down");
		rawMap.layers[5] = this.createEmptyLayer("terrain coast line");
		rawMap.layers[6] = this.createEmptyLayer("terrain top");

		//blend land tiles
		for(let y=0; y < rawMap.height; y++){
			for(let x=0; x < rawMap.width; x++){
			//the map is ordered column first

				let center = this.mapData.getTileInfo(new Position({
					x: x,
					y: y,
					type: Position.TILE
				}));
				let left = this.mapData.getTileInfo(new Position({
					x: x-1,
					y: y,
					type: Position.TILE
				}));
				let right = this.mapData.getTileInfo(new Position({
					x: x+1,
					y: y,
					type: Position.TILE
				}));
				let top = this.mapData.getTileInfo(new Position({
					x: x,
					y: y-1,
					type: Position.TILE
				}));
				let down = this.mapData.getTileInfo(new Position({
					x: x,
					y: y+1,
					type: Position.TILE
				}));


				let baseTile = this.mapData.tiles[x + y * rawMap.width].id;
				let leftBlend = 0;
				let rightBlend = 0;
				let topBlend = 0;
				let downBlend = 0;

				if(
					x !== 0 &&
					typeof center.props !== 'undefined' &&
					typeof left.props !== 'undefined' && 
					center.props.domain === 'land' &&
					left.props.domain === 'land' ){
					leftBlend = left.props.centerTile + 1;
				}

				if(
					x + 1 < rawMap.height &&
					typeof center.props !== 'undefined' &&
					typeof right.props !== 'undefined' &&
					center.props.domain === 'land' &&
					right.props.domain === 'land'){
					rightBlend = right.props.centerTile - 1;
				}				

				if(
					y !== 0 &&
					typeof center.props !== 'undefined' &&
					typeof top.props !== 'undefined' && 
					center.props.domain === 'land' &&
					top.props.domain === 'land' ){
					topBlend = top.props.centerTile + Settings.tiles.x;
				}

				if(
					y + 1 < rawMap.height &&
					typeof center.props !== 'undefined' &&
					typeof down.props !== 'undefined' &&
					center.props.domain === 'land' &&
					down.props.domain === 'land'){
					downBlend = down.props.centerTile - Settings.tiles.x;
				}

				rawMap.layers[0].data.push(baseTile);
				rawMap.layers[1].data.push(leftBlend);
				rawMap.layers[2].data.push(topBlend);
				rawMap.layers[3].data.push(rightBlend);
				rawMap.layers[4].data.push(downBlend);
			}
		}

		//draw coast lines
		for(let y=0; y < rawMap.height; y++){
			for(let x=0; x < rawMap.width; x++){

				let center = this.mapData.getTileInfo(new Position({
					x: x,
					y: y,
					type: Position.TILE
				}));
				let left = this.mapData.getTileInfo(new Position({
					x: x-1,
					y: y,
					type: Position.TILE
				}));
				let right = this.mapData.getTileInfo(new Position({
					x: x+1,
					y: y,
					type: Position.TILE
				}));
				let top = this.mapData.getTileInfo(new Position({
					x: x,
					y: y-1,
					type: Position.TILE
				}));
				let down = this.mapData.getTileInfo(new Position({
					x: x,
					y: y+1,
					type: Position.TILE
				}));


				let coastTile = 0;
				if(
					x !== 0 &&
					y !== 0 &&
					y + 1 < rawMap.height &&
					x + 1 < rawMap.width &&
					typeof center.props !== 'undefined' &&
					typeof left.props !== 'undefined' &&
					typeof top.props !== 'undefined' &&
					typeof down.props !== 'undefined' &&
					typeof right.props !== 'undefined' &&
					center.props.domain === 'sea'){

						if(top.props.domain === 'land' && down.props.domain === 'sea' && left.props.domain === 'sea' && right.props.domain === 'sea'){
							coastTile = Terrain.coast.south;
						}
						if(top.props.domain === 'sea' && down.props.domain === 'land' && left.props.domain === 'sea' && right.props.domain === 'sea'){
							coastTile = Terrain.coast.north;
						}
						if(top.props.domain === 'sea' && down.props.domain === 'sea' && left.props.domain === 'land' && right.props.domain === 'sea'){
							coastTile = Terrain.coast.east;
						}
						if(top.props.domain === 'sea' && down.props.domain === 'sea' && left.props.domain === 'sea' && right.props.domain === 'land'){
							coastTile = Terrain.coast.west;
						}

						if(top.props.domain === 'land' && down.props.domain === 'sea' && left.props.domain === 'land' && right.props.domain === 'sea'){
							coastTile = Terrain.coast.southEast;
						}
						if(top.props.domain === 'land' && down.props.domain === 'sea' && left.props.domain === 'sea' && right.props.domain === 'land'){
							coastTile = Terrain.coast.southWest;
						}
						if(top.props.domain === 'sea' && down.props.domain === 'land' && left.props.domain === 'land' && right.props.domain === 'sea'){
							coastTile = Terrain.coast.northEast;
						}
						if(top.props.domain === 'sea' && down.props.domain === 'land' && left.props.domain === 'sea' && right.props.domain === 'land'){
							coastTile = Terrain.coast.northWest;
						}

						if(top.props.domain === 'sea' && down.props.domain === 'land' && left.props.domain === 'land' && right.props.domain === 'land'){
							coastTile = Terrain.coast.southBay;
						}
						if(top.props.domain === 'land' && down.props.domain === 'sea' && left.props.domain === 'land' && right.props.domain === 'land'){
							coastTile = Terrain.coast.northBay;
						}
						if(top.props.domain === 'land' && down.props.domain === 'land' && left.props.domain === 'sea' && right.props.domain === 'land'){
							coastTile = Terrain.coast.eastBay;
						}
						if(top.props.domain === 'land' && down.props.domain === 'land' && left.props.domain === 'land' && right.props.domain === 'sea'){
							coastTile = Terrain.coast.westBay;
						}

						if(top.props.domain === 'land' && down.props.domain === 'land' && left.props.domain === 'land' && right.props.domain === 'land'){
							coastTile = Terrain.coast.lake;
						}
						if(top.props.domain === 'land' && down.props.domain === 'land' && left.props.domain === 'sea' && right.props.domain === 'sea'){
							coastTile = Terrain.coast.eastWestPassage;
						}
						if(top.props.domain === 'sea' && down.props.domain === 'sea' && left.props.domain === 'land' && right.props.domain === 'land'){
							coastTile = Terrain.coast.northSouthPassage;
						}

				}

				rawMap.layers[5].data.push(coastTile);
			}
		}


		//add forest, hills and mountains
		for(let y=0; y < rawMap.height; y++){
			for(let x=0; x < rawMap.width; x++){
				let center = this.mapData.getTileInfo(new Position({
					x: x,
					y: y,
					type: Position.TILE
				}));

				let topTile = 0;
				if(center.forest){
					topTile = Terrain.forest.id;
				}
				if(center.hills){
					topTile = Terrain.hills.id;
				}
				if(center.mountains){
					topTile = Terrain.mountains.id;
				}

				rawMap.layers[6].data.push(topTile);
			}
		}



    	Colonize.game.load.tilemap('map', null, rawMap, Phaser.Tilemap.TILED_JSON)
    	this.tilemap = Colonize.game.add.tilemap('map');
    	// console.log(this.tilemap);

		this.tilemap.addTilesetImage(this.getTilesetName(), 'mapTiles');

    	this.baseLayer = this.tilemap.createLayer('terrain base');
		this.blendleftLayer = this.tilemap.createLayer('terrain blend left');
		this.blendtopLayer = this.tilemap.createLayer('terrain blend top');
		this.blendrightLayer = this.tilemap.createLayer('terrain blend right');
		this.blenddownLayer = this.tilemap.createLayer('terrain blend down');
		this.blendcoastLayer = this.tilemap.createLayer('terrain coast line');
    	this.topLayer = this.tilemap.createLayer('terrain top');

    	//make the world big enough
    	this.baseLayer.resizeWorld();

    	Colonize.pointerInput.registerClickLayer(this.baseLayer);
	}

	getTilesetName(){
		return MapSettings.tilesets[0].name;
	}

	createEmptyLayer(name){
		return {
			height : MapSettings.height,
			width : MapSettings.width,
			name : name,
			opacity : 1,
			type : "tilelayer",
			visible : true,
			x : 0,
			y : 0,
			data: []
		};		
	}

}

export default MapView;