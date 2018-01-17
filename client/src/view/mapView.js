
import PIXI from 'pixi';
import Colonize from '../colonize.js';
import MapSettings from '../../data/map.json';
import Settings from '../../data/settings.json';
import Terrain from '../../data/terrain.json';
import TilemapRenderer from '../render/tilemapRenderer.js';
import BackgroundView from './BackgroundView.js';
import SpriteRenderer from '../render/spriteRenderer.js';
import MapTileView from './mapTileView.js';

import Position from '../helper/position.js';


class MapView{

	constructor(props){
		this.mapData = props.mapData;

		this.background = new BackgroundView();
		// this.renderer = new TilemapRenderer();
		this.renderer = new SpriteRenderer();

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

	render(){
		this.renderer.render();
	}

	renderTile(tile){
		let tileView = new MapTileView();

		tileView.addTiles(this.renderBaseTiles(tile));
		tileView.newLayer();
		tileView.addTiles(this.renderTerrainBlending(tile));
		tileView.newLayer();
		tileView.addTiles(this.renderCoastLine(tile));
		tileView.addTiles(this.renderTopTiles(tile));
		tileView.newLayer();
		tileView.addTiles(this.renderUndiscovered(tile));

		return tileView;
	}

	updateTile(tile){
		let tileView = this.renderTile(tile);
		this.renderer.updateTile(tile, tileView);
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
			if(other.props.domain === 'land'){
				if(other.props.id != center.props.id)
					return other.props.centerTile + offset;
			}

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

		let left = center.getLeft();
		let right = center.getRight();
		let up = center.getUp();
		let down = center.getDown();


		let undiscovered = [];

		if(up !== null && right !== null && down !== null && left !== null){		
			let name = this.neighborToName(!up.discovered, !right.discovered, !down.discovered, !left.discovered);
			if(name !== null)
				undiscovered.push(Terrain.undiscovered[name]);
		}

		return undiscovered;
	}


	renderBaseTiles(tile){
		let baseTiles = [];
		let center = this.mapData.getTileInfo(tile);

		if(center !== null && center.discovered){
			if(center.coastTerrain !== null){
				baseTiles.push(center.coastTerrain.id);
			}
			else{
				baseTiles.push(center.id);
			}
		}

		return baseTiles;
	}


	renderTerrainBlending(tile){
		let center = this.mapData.getTileInfo(tile);
		let left = center.getLeft();
		let right = center.getRight();
		let up = center.getUp();
		let down = center.getDown();

		let blendTiles = [];

		let leftBlend = this.decideBlending(center, left, 1);
		let rightBlend = this.decideBlending(center, right, -1);
		let upBlend = this.decideBlending(center, up, Settings.tiles.x);
		let downBlend = this.decideBlending(center, down, -Settings.tiles.x);

		if(leftBlend !== 0)
			blendTiles.push(leftBlend);
		if(rightBlend !== 0)
			blendTiles.push(rightBlend);
		if(upBlend !== 0)
			blendTiles.push(upBlend);
		if(downBlend !== 0)
			blendTiles.push(downBlend);

		return blendTiles;
	}

	renderCoastLine(tile){

		let center = this.mapData.getTileInfo(tile);
		let left = center.getLeft();
		let right = center.getRight();
		let up = center.getUp();
		let down = center.getDown();

		let coastTiles = [];
		if(
			center !== null &&
			center.discovered &&
			left !== null &&
			right !== null &&
			up !== null &&
			down !== null &&
			typeof center.props !== 'undefined' &&
			typeof left.props !== 'undefined' &&
			typeof up.props !== 'undefined' &&
			typeof down.props !== 'undefined' &&
			typeof right.props !== 'undefined' &&
			center.props.domain === 'sea'
		){
			let name = this.neighborToName(
				up.props.domain === 'land',
				right.props.domain === 'land',
				down.props.domain === 'land',
				left.props.domain === 'land'
			);

			if(name !== null)
				coastTiles.push(Terrain.coast[name]);
		}

		return coastTiles;
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

	renderTopTiles(position){
		let center = this.mapData.getTileInfo(position);

		let topTiles = [];
		if(center !== null && center.discovered){		
			if(center.forest){
				topTiles.push(Terrain.forest.id);
			}
			if(center.hills){
				topTiles.push(Terrain.hills.id);
			}
			if(center.mountains){
				topTiles.push(Terrain.mountains.id);
			}
		}

		return topTiles;
	}

}

export default MapView;