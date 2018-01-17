
import PIXI from 'pixi';
import Colonize from '../colonize.js';
import MapSettings from '../../data/map.json';
import Settings from '../../data/settings.json';
import Terrain from '../../data/terrain.json';
import TilemapRenderer from '../render/TilemapRenderer.js';
import BackgroundView from './BackgroundView.js';

import Position from '../helper/position.js';


class MapView{

	constructor(props){
		this.mapData = props.mapData;

		this.background = new BackgroundView();
		this.renderer = new TilemapRenderer();

		for(let y=0; y < MapSettings.height; y++){
			for(let x=0; x < MapSettings.width; x++){

				//the map is ordered column first
				let tile = new Position({
					x: x,
					y: y,
					type: Position.TILE
				});

				let layers = this.renderTile(tile);
				this.renderer.pushTile(tile, layers);
			}
		}

		this.renderer.initialize();
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
		this.renderer.updateTile(tile, layers);
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
			y + 1 < MapSettings.height &&
			x + 1 < MapSettings.width &&
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

}

export default MapView;