
import Colonize from '../colonize.js';
import MapSettings from '../../data/map.json';
import Settings from '../../data/settings.json';

import Position from '../helper/position.js';


class MapView{

	constructor(props){
		this.mapData = props.mapData;

		let rawMap = MapSettings;
		rawMap.layers = [];
		rawMap.layers[0] = this.createEmptyLayer("terrain base");
		for(let index=0; index < rawMap.width*rawMap.height; index++){
			// rawMap.layers[0].data.push(this.mapData.tiles[index].id);
		}
		rawMap.layers[1] = this.createEmptyLayer("terrain blend left");
		rawMap.layers[2] = this.createEmptyLayer("terrain blend top");
		rawMap.layers[3] = this.createEmptyLayer("terrain blend right");
		rawMap.layers[4] = this.createEmptyLayer("terrain blend down");
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


				let baseTile = this.mapData.tiles[x + y * rawMap.width].id;
				let leftBlend = 0;
				let rightBlend = 0;
				let topBlend = 0;
				let downBlend = 0;

				if(
					x !== 0 &&
					typeof center.props !== 'undefined' &&
					typeof left.props !== 'undefined' && 
					center.props.allowLand &&
					left.props.allowLand ){
					leftBlend = left.props.centerTile + 1;
				}

				if(
					x + 1 < rawMap.height &&
					typeof center.props !== 'undefined' &&
					typeof right.props !== 'undefined' &&
					center.props.allowLand &&
					right.props.allowLand){
					rightBlend = right.props.centerTile - 1;
				}				

				if(
					y !== 0 &&
					typeof center.props !== 'undefined' &&
					typeof top.props !== 'undefined' && 
					center.props.allowLand &&
					top.props.allowLand ){
					topBlend = top.props.centerTile + Settings.tiles.x;
				}

				if(
					y + 1 < rawMap.height &&
					typeof center.props !== 'undefined' &&
					typeof down.props !== 'undefined' &&
					center.props.allowLand &&
					down.props.allowLand){
					downBlend = down.props.centerTile - Settings.tiles.x;
				}

				rawMap.layers[0].data.push(baseTile);
				rawMap.layers[1].data.push(leftBlend);
				rawMap.layers[2].data.push(topBlend);
				rawMap.layers[3].data.push(rightBlend);
				rawMap.layers[4].data.push(downBlend);
			}
		}


		// for(let index=0; index< 200*200; index++){
		// 	this.mapData.data.layers[0].data[index] = 90;
		// }

    	Colonize.game.load.tilemap('map', null, rawMap, Phaser.Tilemap.TILED_JSON)
    	this.tilemap = Colonize.game.add.tilemap('map');
    	// console.log(this.tilemap);

		this.tilemap.addTilesetImage(this.getTilesetName(), 'mapTiles');

    	this.baseLayer = this.tilemap.createLayer('terrain base');
		this.blendleftLayer = this.tilemap.createLayer('terrain blend left');
		this.blendtopLayer = this.tilemap.createLayer('terrain blend top');
		this.blendrightLayer = this.tilemap.createLayer('terrain blend right');
		this.blenddownLayer = this.tilemap.createLayer('terrain blend down');
		// this.blendcoastLayer = this.tilemap.createLayer('terrain blend coast');
		// this.blendcoast2Layer = this.tilemap.createLayer('terrain blend coast 2');
    	// this.topLayer = this.tilemap.createLayer('terrain top');

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