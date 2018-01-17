

import Colonize from '../colonize.js';
import MapSettings from '../../data/map.json';

class TilemapRenderer{

	constructor(props){
		//create layers
		this.rawMap = MapSettings;
		this.rawMap.layers = [];
		this.rawMap.layers[0] = this.createEmptyLayer("terrain base");
		this.rawMap.layers[1] = this.createEmptyLayer("terrain blend left");
		this.rawMap.layers[2] = this.createEmptyLayer("terrain blend top");
		this.rawMap.layers[3] = this.createEmptyLayer("terrain blend right");
		this.rawMap.layers[4] = this.createEmptyLayer("terrain blend down");
		this.rawMap.layers[5] = this.createEmptyLayer("terrain coast line");
		this.rawMap.layers[6] = this.createEmptyLayer("terrain blend undiscovered");
		this.rawMap.layers[7] = this.createEmptyLayer("terrain top");		
	}

	pushTile(tile, layers){
		this.rawMap.layers[0].data.push(layers.baseTile);
		this.rawMap.layers[1].data.push(layers.leftBlend);
		this.rawMap.layers[2].data.push(layers.topBlend);
		this.rawMap.layers[3].data.push(layers.rightBlend);
		this.rawMap.layers[4].data.push(layers.downBlend);
		this.rawMap.layers[5].data.push(layers.coastTile);
		this.rawMap.layers[6].data.push(layers.undiscovered);
		this.rawMap.layers[7].data.push(layers.topTile);
	}

	initialize(){
    	Colonize.game.load.tilemap('map', null, this.rawMap, Phaser.Tilemap.TILED_JSON)
    	this.tilemap = Colonize.game.add.tilemap('map');

		this.tilemap.addTilesetImage(this.getTilesetName(), 'mapTiles');

    	this.baseLayer = this.tilemap.createLayer('terrain base');
		this.blendleftLayer = this.tilemap.createLayer('terrain blend left');
		this.blendtopLayer = this.tilemap.createLayer('terrain blend top');
		this.blendrightLayer = this.tilemap.createLayer('terrain blend right');
		this.blenddownLayer = this.tilemap.createLayer('terrain blend down');
		this.blendcoastLayer = this.tilemap.createLayer('terrain coast line');
		this.undiscoveredLayer = this.tilemap.createLayer('terrain blend undiscovered');
    	this.topLayer = this.tilemap.createLayer('terrain top');
	}

	updateTile(tile, layers){
		if(layers.baseTile !== 0)
			this.tilemap.putTile(layers.baseTile, tile.x, tile.y, this.baseLayer);
		else
			this.tilemap.removeTile(tile.x, tile.y, this.baseLayer);

		if(layers.leftBlend !== 0)
			this.tilemap.putTile(layers.leftBlend, tile.x, tile.y, this.blendleftLayer);
		else
			this.tilemap.removeTile(tile.x, tile.y, this.blendleftLayer);

		if(layers.topBlend !== 0)
			this.tilemap.putTile(layers.topBlend, tile.x, tile.y, this.blendtopLayer);
		else
			this.tilemap.removeTile(tile.x, tile.y, this.blendtopLayer);

		if(layers.rightBlend !== 0)
			this.tilemap.putTile(layers.rightBlend, tile.x, tile.y, this.blendrightLayer);
		else
			this.tilemap.removeTile(tile.x, tile.y, this.blendrightLayer);

		if(layers.downBlend !== 0)
			this.tilemap.putTile(layers.downBlend, tile.x, tile.y, this.blenddownLayer);
		else
			this.tilemap.removeTile(tile.x, tile.y, this.blenddownLayer);

		if(layers.coastTile !== 0)
			this.tilemap.putTile(layers.coastTile, tile.x, tile.y, this.blendcoastLayer);
		else
			this.tilemap.removeTile(tile.x, tile.y, this.blendcoastLayer);

		if(layers.undiscovered !== 0)
			this.tilemap.putTile(layers.undiscovered, tile.x, tile.y, this.undiscoveredLayer);
		else
			this.tilemap.removeTile(tile.x, tile.y, this.undiscoveredLayer);

		if(layers.topTile !== 0)
			this.tilemap.putTile(layers.topTile, tile.x, tile.y, this.topLayer);
		else
			this.tilemap.removeTile(tile.x, tile.y, this.topLayer);		
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

	render(){
		//not needed, but here so the call does not fail
	}

	updateCulling(){
		//not needed, but here so the call does not fail
	}


}

export default TilemapRenderer;