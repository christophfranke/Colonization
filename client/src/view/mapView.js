
import PIXI from 'pixi';
import Colonize from '../colonize.js';
import Settings from '../../data/settings.json';
import Terrain from '../../data/terrain.json';
import BackgroundView from './BackgroundView.js';
import SpriteRenderer from '../render/spriteRenderer.js';
import MapTileView from './mapTileView.js';

import Position from '../helper/position.js';


class MapView{

	constructor(props){
		this.mapData = props.mapData;

		this.background = new BackgroundView();
		this.renderer = new SpriteRenderer();

		for(let y=0; y < this.mapData.numTiles.y; y++){
			for(let x=0; x < this.mapData.numTiles.x; x++){

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

	hide(){
		this.renderer.hide();
	}

	show(){
		this.renderer.show();
	}

	renderTile(tile){
		let tileView = new MapTileView();

		tileView.addTiles(this.renderBaseBlock(tile));
		tileView.addCacheLayer();
		tileView.addTiles(this.renderTopTiles(tile));
		tileView.addTiles(this.renderCoast(tile));
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

	renderBaseBlock(tile){
		let indices = [];

		let center = this.mapData.getTileInfo(tile);
		if(center === null || !center.discovered || typeof center.props === 'undefined')
			return indices;

		let left = center.getLeft();
		let right = center.getRight();
		let up = center.getUp();
		let down = center.getDown();

		if(up !== null && right !== null && down !== null && left !== null){		
			let leftUp = left.getUp();
			let leftDown = left.getDown();
			let rightUp = right.getUp();
			let rightDown = right.getDown();
			if(leftUp !== null && leftDown !== null && rightUp !== null && rightDown !== null){

				if(typeof rightDown.props !== 'undefined')
					indices.push(this.getTileIndex(rightDown, -1, -1, center));
				if(typeof down.props !== 'undefined')
					indices.push(this.getTileIndex(down, 0, -1, center));
				if(typeof leftDown.props !== 'undefined')
					indices.push(this.getTileIndex(leftDown, 1, -1, center));

				if(typeof right.props !== 'undefined')
					indices.push(this.getTileIndex(right, -1, 0, center));
				if(typeof center.props !== 'undefined')
					indices.push(this.getTileIndex(center, 0, 0, center));
				if(typeof left.props !== 'undefined')
					indices.push(this.getTileIndex(left, 1, 0, center));

				if(typeof rightUp.props !== 'undefined')
					indices.push(this.getTileIndex(rightUp, -1, 1, center));
				if(typeof up.props !== 'undefined')
					indices.push(this.getTileIndex(up, 0, 1, center));
				if(typeof leftUp.props !== 'undefined')
					indices.push(this.getTileIndex(leftUp, 1, 1, center));
			}
		}

		return indices;
	}

	centerTileMod(x, y){
		return Settings.tiles.x*y+x;
	}

	decideLandSeaTile(center, tileInfo){
		// on land always take land
		if(center.props.domain === 'land'){
			//either from land
			if(tileInfo.props.domain === 'land')
				return tileInfo.props.centerTile;
			//or from coast
			if(tileInfo.props.domain === 'sea' && tileInfo.coastTerrain !== null)
				return tileInfo.coastTerrain.centerTile;
			//or from self
			return center.props.centerTile;
		}

		// coast wants land from everybody
		if(center.props.domain === 'sea' && center.coastTerrain !== null){
			//take land from land tile
			if(tileInfo.props.domain === 'land')
				return tileInfo.props.centerTile;
			//or from coast terrain
			if(tileInfo.coastTerrain !== null)
				return tileInfo.coastTerrain.centerTile;
			//or from self
			return center.props.centerTile;
		}

		// sea always wants sea
		if(center.props.domain === 'sea' && center.coastTerrain === null){
			//take sea tile
			if(tileInfo.props.domain === 'sea'){
				//either coastal
				if(tileInfo.isCoastalSea || tileInfo.coastTerrain !== null)
					return Terrain['coastal sea'].centerTile;
				//or deep sea
				return tileInfo.props.centerTile;
			}
			//from land tiles take coastal sea
			return Terrain['coastal sea'].centerTile;			
		}
	}

	getTileIndex(tileInfo, x, y, center){
		return this.decideLandSeaTile(center, tileInfo) + this.centerTileMod(x, y);
	}

	renderUndiscovered(tile){
		let undiscovered = [];

		let center = this.mapData.getTileInfo(tile);
		if(center === null || !center.discovered)
			return undiscovered;

		let left = center.getLeft();
		let right = center.getRight();
		let up = center.getUp();
		let down = center.getDown();


		if(up !== null && right !== null && down !== null && left !== null){		
			let name = this.neighborToName(!up.discovered, !right.discovered, !down.discovered, !left.discovered);
			if(name !== null)
				undiscovered.push(Terrain.undiscovered[name]);

			let leftUp = left.getUp();
			let leftDown = left.getDown();
			let rightUp = right.getUp();
			let rightDown = right.getDown();

			if(leftUp !== null && leftDown !== null && rightUp !== null && rightDown !== null){
				let cornerNames = this.getCornerNames(
					!up.discovered,
					!rightUp.discovered,
					!right.discovered,
					!rightDown.discovered,
					!down.discovered,
					!leftDown.discovered,
					!left.discovered,
					!leftUp.discovered
				);
				for(let name of cornerNames){
					// console.error(tile, name);
					undiscovered.push(Terrain.undiscovered[name]);
				}
							
			}

		}

		return undiscovered;
	}


	renderBaseTiles(tile){
		let baseTiles = [];
		let center = this.mapData.getTileInfo(tile);

		if(center !== null && center.discovered){
			if(center.coastTerrain !== null){
				baseTiles.push(center.coastTerrain.centerTile);
			}
			else{
				baseTiles.push(center.props.centerTile);
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

	renderTerrainOverdraw(tile){
		let tiles = [];

		let center = this.mapData.getTileInfo(tile);
		let up = center.getUp();
		let left = center.getLeft();

		if(center !== null && left !== null && up !== null){
			let upLeft = up.getLeft();
			if(upLeft !== null){
				if(
					typeof center.props !== 'undefined' &&
					typeof up.props !== 'undefined' &&
					typeof left.props !== 'undefined' &&
					typeof upLeft.props !== 'undefined'
				){
					if(
						(up.props.domain === 'land' || center.props.domain === 'sea') &&
						(up.discovered && center.discovered)
					){
						tiles.push(up.props.centerTile + Settings.tiles.x);
					}
					if(
						(left.props.domain === 'land' || center.props.domain === 'sea') &&
						(left.discovered && center.discovered)
					){
						tiles.push(left.props.centerTile + 1)
					}
					if(
						(upLeft.props.domain === 'land' || center.props.domain === 'sea') &&
						(upLeft.discovered && center.discovered)
					){
						tiles.push(upLeft.props.centerTile + Settings.tiles.x + 1);
					}

					if(
						(up.props.domain === 'sea' && center.props.domain === 'land') &&
						(up.discovered && center.discovered) &&
						(up.coastTerrain !== null)
					){
						tiles.push(up.coastTerrain.centerTile + Settings.tiles.x);
					}
					if(
						(left.props.domain === 'sea' && center.props.domain === 'land') &&
						(left.discovered && center.discovered) &&
						(left.coastTerrain !== null)
					){
						tiles.push(left.coastTerrain.centerTile + 1)
					}
					if(
						(upLeft.props.domain === 'sea' && center.props.domain === 'land') &&
						(upLeft.discovered && center.discovered) &&
						(upLeft.coastTerrain !== null)
					){
						tiles.push(upLeft.coastTerrain.centerTile + Settings.tiles.x + 1);
					}
				}
			}
		}

		return tiles;
	}

	renderCoast(tile){
		let indices = [];		
		indices = [...indices, ...this.renderCoastLine(tile)];
		indices = [...indices, ...this.renderCoastCorners(tile)];
		indices = [...indices, ...this.renderCoastalSea(tile)];

		return indices;
	}

	renderCoastalSea(tile){
		let indices = [];

		let center = this.mapData.getTileInfo(tile);
		let left = center.getLeft();
		let right = center.getRight();
		let up = center.getUp();
		let down = center.getDown();

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
			center.props.domain === 'sea' &&
			center.coastTerrain !== null
		){
			let leftUp = left.getUp();
			let leftDown = left.getDown();
			let rightUp = right.getUp();
			let rightDown = right.getDown();

			if(
				leftUp !== null && typeof leftUp.props !== 'undefined' &&
				rightUp !== null && typeof rightUp.props !== 'undefined' &&
				leftDown !== null && typeof leftDown.props !== 'undefined' &&
				rightDown !== null && typeof rightDown.props !== 'undefined'
			){
				if(leftUp.props.domain === 'sea' && left.props.domain === 'sea' && up.props.domain === 'sea')
					indices.push(Terrain['coastal sea'].northWestCorner);
				if(leftDown.props.domain === 'sea' && left.props.domain === 'sea' && down.props.domain === 'sea')
					indices.push(Terrain['coastal sea'].southWestCorner);
				if(rightUp.props.domain === 'sea' && right.props.domain === 'sea' && up.props.domain === 'sea')
					indices.push(Terrain['coastal sea'].northEastCorner);
				if(rightDown.props.domain === 'sea' && right.props.domain === 'sea' && down.props.domain === 'sea')
					indices.push(Terrain['coastal sea'].southEastCorner);
			}
		}

		return indices;
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

	renderCoastCorners(tile){
		let corners = [];

		let center = this.mapData.getTileInfo(tile);
		if(center !== null){
			//no corners on land tiles
			if(typeof center.props === 'undefined' || center.props.domain === 'land' || !center.discovered)
				return corners;

			let left = center.getLeft();
			let right = center.getRight();
			let up = center.getUp();
			let down = center.getDown();
			if(left !== null && right !== null && up !== null && down !== null){

				let leftUp = left.getUp();
				let leftDown = left.getDown();
				let rightUp = right.getUp();
				let rightDown = right.getDown();

				if(
					leftUp !== null && typeof leftUp.props !== 'undefined' &&
					rightUp !== null && typeof rightUp.props !== 'undefined' &&
					leftDown !== null && typeof leftDown.props !== 'undefined' &&
					rightDown !== null && typeof rightDown.props !== 'undefined'
				){
					let cornerNames = this.getCornerNames(
						up.props.domain === 'land',
						rightUp.props.domain === 'land',
						right.props.domain === 'land',
						rightDown.props.domain === 'land',
						down.props.domain === 'land',
						leftDown.props.domain === 'land',
						left.props.domain === 'land',
						leftUp.props.domain === 'land',
					);
					for(let name of cornerNames){
						corners.push(Terrain.coast[name]);
					}
				}
			}
		}

		return corners;
	}

	getCornerNames(up, rightUp, right, rightDown, down, leftDown, left, leftUp){
		let cornerNames = [];

		if(leftUp && !up && !left){
			cornerNames.push('southEastCorner');
		}
		if(leftDown && !left && !down){
			cornerNames.push('northEastCorner');
		}
		if(rightUp && !right && !up){
			cornerNames.push('southWestCorner');
		}
		if(rightDown && !right && !down){
			cornerNames.push('northWestCorner');
		}

		return cornerNames;
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

	getForestTileModifier(up, right, down, left){
		let y = Settings.tiles.x;

		if(!up && !right && !down && !left)
			return 0;

		if(!up && right && !down && !left)
			return 1;
		if(!up && right && !down && left)
			return 2;
		if(!up && !right && !down && left)
			return 3;

		if(!up && !right && down && !left)
			return 1*y;
		if(up && !right && down && !left)
			return 2*y;
		if(up && !right && !down && !left)
			return 3*y;

		if(!up && right && down && !left)
			return 1*y + 1;
		if(!up && right && down && left)
			return 1*y + 2;
		if(!up && !right && down && left)
			return 1*y + 3;

		if(up && right && down && !left)
			return 2*y + 1;
		if(up && right && down && left)
			return 2*y + 2;
		if(up && !right && down && left)
			return 2*y + 3;

		if(up && right && !down && !left)
			return 3*y + 1;
		if(up && right && !down && left)
			return 3*y + 2;
		if(up && !right && !down && left)
			return 3*y + 3;

	}

	renderTopTiles(position){
		let center = this.mapData.getTileInfo(position);

		let topTiles = [];
		if(center !== null && center.discovered){
			let left = center.getLeft();
			let right = center.getRight();
			let up = center.getUp();
			let down = center.getDown();

			if(center.hills){
				let mod = this.getForestTileModifier(up.hills, right.hills, down.hills, left.hills);
				topTiles.push(Terrain.hills.singleTile + mod);
			}
			if(center.mountains){
				let mod = this.getForestTileModifier(up.mountains, right.mountains, down.mountains, left.mountains);
				topTiles.push(Terrain.mountains.singleTile + mod);
			}
			if(center.river){
				let mod = this.getForestTileModifier(up.river, right.river, down.river, left.river);
				topTiles.push(Terrain.river.singleTile + mod);
			}
			if(center.forest){
				let mod = this.getForestTileModifier(up.forest, right.forest, down.forest, left.forest);
				topTiles.push(Terrain.forest.singleTile + mod);
			}
		}

		return topTiles;
	}

}

export default MapView;