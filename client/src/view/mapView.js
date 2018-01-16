
import PIXI from 'pixi';
import Colonize from '../colonize.js';
import MapSettings from '../../data/map.json';
import Settings from '../../data/settings.json';
import Terrain from '../../data/terrain.json';

import Position from '../helper/position.js';


class MapView{

	constructor(props){
		this.mapData = props.mapData;

		let worldDimensions = {
			x: this.mapData.numTiles.x*Settings.tileSize.x,
			y: this.mapData.numTiles.y*Settings.tileSize.y
		}
		Colonize.game.world.resize(worldDimensions.x, worldDimensions.y);

		let imageDimensions = {
			x: 1024,
			y: 1024
		};

		for(let x = 0; x*imageDimensions.x < worldDimensions.x; x++){
			for(let y = 0; y*imageDimensions.y < worldDimensions.y; y++){
				Colonize.game.add.image(x*imageDimensions.x, y*imageDimensions.y, 'undiscovered');
			}
		}

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

		for(let y=0; y < this.rawMap.height; y++){
			for(let x=0; x < this.rawMap.width; x++){

				//the map is ordered column first
				let position = new Position({
					x: x,
					y: y,
					type: Position.TILE
				});

				let result = this.renderTile(position);

				this.rawMap.layers[0].data.push(result.baseTile);
				this.rawMap.layers[1].data.push(result.leftBlend);
				this.rawMap.layers[2].data.push(result.topBlend);
				this.rawMap.layers[3].data.push(result.rightBlend);
				this.rawMap.layers[4].data.push(result.downBlend);
				this.rawMap.layers[5].data.push(result.coastTile);
				this.rawMap.layers[6].data.push(result.undiscovered);
				this.rawMap.layers[7].data.push(result.topTile);
			}
		}


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

    	Colonize.pointerInput.registerClickLayer(this.topLayer);
	}

	renderTile(tile){
		let layers = this.renderBaseTerrain(tile);
		layers.coastTile = this.renderCoastLine(tile);
		layers.undiscovered = this.renderUndiscovered(tile);
		layers.topTile = this.renderTopTile(tile);

		return layers;
	}

	updateTile(tile){
		let layers = this.renderTile(tile);
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

	decideBlending(center, other, offset){

		//do not crash if map has errors or we are at the border
		if(center === null || other === null || typeof center === 'undefined' || typeof other === 'undefined')
			return 0;
		if(typeof center.props === 'undefined' || typeof other.props === 'undefined')
			return 0;

		//blending for sea
		if(center.props.domain === 'sea'){

			if(!center.discovered && other.discovered){
				return center.props.centerTile + offset;
			}

			if(center.discovered && other.discovered && other.props.domain === 'land'){
				return other.props.centerTile + offset;
			}

			return 0;
		}

		//undiscovered but next to discovered terrain
		if(!center.discovered && other.discovered){

			//next to sea tiles blend own terrain type into center
			if(other.props.domain === 'sea'){
				return center.props.centerTile + offset;
			}

			//next to land blend other terrain into center
			if(other.props.domain === 'land'){
				return other.props.centerTile + offset;
			}
		}

		//both discovered
		if(center.discovered && other.discovered){
			//blend between land
			if(other.props.domain === 'land')
				return other.props.centerTile + offset;

			//blend between coast
			if(other.props.domain === 'sea' && other.coastTerrain !== null)
				return other.coastTerrain.centerTile + offset;
		}

		return 0;
	}

	renderUndiscovered(tile){

		let center = this.mapData.getTileInfo(tile);

		if(center === null || !center.discovered)
			return 0;

		let x = tile.x;
		let y = tile.y;

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
		let up = this.mapData.getTileInfo(new Position({
			x: x,
			y: y-1,
			type: Position.TILE
		}));
		let down = this.mapData.getTileInfo(new Position({
			x: x,
			y: y+1,
			type: Position.TILE
		}));

		let undiscovered = 0;

		if(up !== null && right !== null && down !== null && left !== null){		
			let name = this.neighborToName(!up.discovered, !right.discovered, !down.discovered, !left.discovered);
			if(name !== null)
				return Terrain.undiscovered[name];
		}

		return 0;
	}


	renderBaseTerrain(tile){
		let center = this.mapData.getTileInfo(tile);
		let x = tile.x;
		let y = tile.y;

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

		let baseTile = Terrain.transparent.id;
		if(center !== null && center.discovered){
			if(center.coastTerrain !== null){
				baseTile = center.coastTerrain.id;
			}
			else{
				baseTile = center.id;
			}
		}

		return {
			baseTile : baseTile,
			leftBlend : this.decideBlending(center, left, 1),
			rightBlend : this.decideBlending(center, right, -1),
			topBlend : this.decideBlending(center, top, Settings.tiles.x),
			downBlend : this.decideBlending(center, down, -Settings.tiles.x)
		};
	}

	renderCoastLine(position){
		let tile = position.getTile();
		let x = tile.x;
		let y = tile.y;

		let center = this.mapData.getTileInfo(tile);
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
			center !== null &&
			center.discovered &&
			x !== 0 &&
			y !== 0 &&
			y + 1 < this.rawMap.height &&
			x + 1 < this.rawMap.width &&
			typeof center.props !== 'undefined' &&
			typeof left.props !== 'undefined' &&
			typeof top.props !== 'undefined' &&
			typeof down.props !== 'undefined' &&
			typeof right.props !== 'undefined' &&
			center.props.domain === 'sea'
		){
			let name = this.neighborToName(
				top.props.domain === 'land',
				right.props.domain === 'land',
				down.props.domain === 'land',
				left.props.domain === 'land'
			);

			if(name !== null)
				coastTile = Terrain.coast[name];
		}

		return coastTile;
	}

	neighborToName(top, right, down, left){
			if(top && !down && !left && !right){
				return 'south';
			}
			if(!top && down && !left && !right){
				return 'north';
			}
			if(!top && !down && left && !right){
				return 'east';
			}
			if(!top && !down && !left && right){
				return 'west';
			}

			if(top && !down && left && !right){
				return 'southEast';
			}
			if(top && !down && !left && right){
				return 'southWest';
			}
			if(!top && down && left && !right){
				return 'northEast';
			}
			if(!top && down && !left && right){
				return 'northWest';
			}

			if(!top && down && left && right){
				return 'southBay';
			}
			if(top && !down && left && right){
				return 'northBay';
			}
			if(top && down && !left && right){
				return 'eastBay';
			}
			if(top && down && left && !right){
				return 'westBay';
			}

			if(top && down && left && right){
				return 'lake';
			}
			if(top && down && !left && !right){
				return 'eastWestPassage';
			}
			if(!top && !down && left && right){
				return 'northSouthPassage';
			}

			return null;
	}

	renderTopTile(position){
		let center = this.mapData.getTileInfo(position);

		let topTile = 0;
		if(center !== null && center.discovered){		
			if(center.forest){
				topTile = Terrain.forest.id;
			}
			if(center.hills){
				topTile = Terrain.hills.id;
			}
			if(center.mountains){
				topTile = Terrain.mountains.id;
			}
		}

		return topTile;
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