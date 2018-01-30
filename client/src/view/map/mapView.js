import Terrain from 'data/terrain.json';

import Settings from 'src/utils/settings.js';
import SpriteRenderer from 'src/render/spriteRenderer.js';
import Position from 'src/utils/position.js';
import MapTileView from 'src/view/common/mapTileView.js';



class MapView{

	constructor(props){
		MapView.instance = this;
		this.map = props.map || Map.instance;

		let worldDimensions = {
			x: this.map.numTiles.x*Settings.tileSize.x,
			y: this.map.numTiles.y*Settings.tileSize.y
		};
		game.world.resize(worldDimensions.x, worldDimensions.y);


		this.renderer = new SpriteRenderer({
			numTiles: this.map.numTiles
		});

		for(let y=0; y < this.map.numTiles.y; y++){
			for(let x=0; x < this.map.numTiles.x; x++){

				//the map is ordered column first
				let tile = this.map.getTileInfo(new Position({
					x: x,
					y: y,
					type: Position.TILE
				}));

				this.assembleTile(tile);
				this.renderer.initTile(tile);
			}
		}

		this.renderer.initialize();
	}

	hide(){
		this.renderer.hide();
	}

	show(){
		this.renderer.show();
	}

	assembleTile(tile){
		tile.view = new MapTileView();

		tile.view.addTiles(this.renderBaseBlock(tile));
		tile.view.addTiles(this.renderTopTiles(tile));
		tile.view.addTiles(this.renderCoast(tile));
		tile.view.addTiles(this.renderBonusResources(tile));
		tile.view.addTiles(this.renderUndiscovered(tile));

		return tile.view;
	}

	updateTile(tile){
		if(tile){		
			let newTiles = [];
			newTiles.push(tile);
			newTiles.push(tile.up());
			newTiles.push(tile.left());
			newTiles.push(tile.down());
			newTiles.push(tile.right());
			newTiles.push(tile.up().left());
			newTiles.push(tile.up().right());
			newTiles.push(tile.down().left());
			newTiles.push(tile.down().right());

			for(let t of newTiles){
				let oldView = t.view;
				let newView = this.assembleTile(t);
				if(t.x === 139 && t.y === 132)
					console.log('potential change', oldView, newView);
				if(!MapTileView.equals(oldView, newView)){
					if(t.x === 139 && t.y === 132)
						console.log('updated', oldView, newView);
					this.renderer.updateTile(t, newView);
				}
			}
		}
	}

	decideBlending(center, other, offset){

		//do not crash if map has errors or we are at the border
		if(!center || !other)
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
				if(other.props.id !== center.props.id)
					return other.props.centerTile + offset;
			}

			//blend between coast
			if(other.props.domain === 'sea' && other.coastTerrain)
				return other.coastTerrain.centerTile + offset;
		}

		return 0;
	}

	renderBaseBlock(center){
		let indices = [];

		if(!center || !center.discovered)
			return indices;

		let left = center.left();
		let right = center.right();
		let up = center.up();
		let down = center.down();

		if(up && right && down && left){		
			let leftUp = left.up();
			let leftDown = left.down();
			let rightUp = right.up();
			let rightDown = right.down();
			if(leftUp && leftDown && rightUp && rightDown){

				indices.push(this.getTileIndex(rightDown, -1, -1, center));
				indices.push(this.getTileIndex(down, 0, -1, center));
				indices.push(this.getTileIndex(leftDown, 1, -1, center));

				indices.push(this.getTileIndex(right, -1, 0, center));
				indices.push(this.getTileIndex(center, 0, 0, center));
				indices.push(this.getTileIndex(left, 1, 0, center));

				indices.push(this.getTileIndex(rightUp, -1, 1, center));
				indices.push(this.getTileIndex(up, 0, 1, center));
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
			if(tileInfo.props.domain === 'sea' && tileInfo.coastTerrain)
				return tileInfo.coastTerrain.centerTile;
			//or from self
			return center.props.centerTile;
		}

		// coast wants land from everybody
		if(center.props.domain === 'sea' && center.coastTerrain){
			//take land from land tile
			if(tileInfo.props.domain === 'land')
				return tileInfo.props.centerTile;
			//or from coast terrain
			if(tileInfo.coastTerrain)
				return tileInfo.coastTerrain.centerTile;
			//or from self
			return center.props.centerTile;
		}

		// sea always wants sea
		if(center.props.domain === 'sea' && !center.coastTerrain){
			//take sea tile
			if(tileInfo.props.domain === 'sea'){
				//either coastal
				if(tileInfo.isCoastalSea || tileInfo.coastTerrain)
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

	renderUndiscovered(center){
		let undiscovered = [];

		if(!center || !center.discovered)
			return undiscovered;

		let left = center.left();
		let right = center.right();
		let up = center.up();
		let down = center.down();


		if(up && right && down && left){		
			let name = this.neighborToName(!up.discovered, !right.discovered, !down.discovered, !left.discovered);
			if(name !== null)
				undiscovered.push(Terrain.undiscovered[name]);

			let leftUp = left.up();
			let leftDown = left.down();
			let rightUp = right.up();
			let rightDown = right.down();

			if(leftUp && leftDown && rightUp && rightDown){
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

	renderCoast(tile){
		let indices = [];		
		indices = [...indices, ...this.renderCoastLine(tile)];
		indices = [...indices, ...this.renderCoastCorners(tile)];
		indices = [...indices, ...this.renderCoastalSea(tile)];

		return indices;
	}

	renderCoastalSea(center){
		let indices = [];

		if(!center)
			return indices;

		let left = center.left();
		let right = center.right();
		let up = center.up();
		let down = center.down();

		if(
			center &&
			center.discovered &&
			left &&
			right &&
			up &&
			down &&
			center.props.domain === 'sea' &&
			center.coastTerrain
		){
			let leftUp = left.up();
			let leftDown = left.down();
			let rightUp = right.up();
			let rightDown = right.down();

			if(leftUp && rightUp && leftDown && rightDown){
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

	renderCoastLine(center){
		let coastTiles = [];

		if(!center)
			return coastTiles;

		let left = center.left();
		let right = center.right();
		let up = center.up();
		let down = center.down();

		if(
			center.discovered &&
			left &&
			right &&
			up &&
			down &&
			center.props.domain === 'sea'
		){
			let name = this.neighborToName(
				up.props.domain === 'land',
				right.props.domain === 'land',
				down.props.domain === 'land',
				left.props.domain === 'land'
			);

			if(name)
				coastTiles.push(Terrain.coast[name]);
		}

		return coastTiles;
	}

	renderCoastCorners(center){
		let corners = [];

		if(center){
			//no corners on land tiles
			if(center.props.domain === 'land' || !center.discovered)
				return corners;

			let left = center.left();
			let right = center.right();
			let up = center.up();
			let down = center.down();
			if(left && right && up && down){

				let leftUp = left.up();
				let leftDown = left.down();
				let rightUp = right.up();
				let rightDown = right.down();

				if(leftUp && rightUp && leftDown && rightDown){
					let cornerNames = this.getCornerNames(
						up.props.domain === 'land',
						rightUp.props.domain === 'land',
						right.props.domain === 'land',
						rightDown.props.domain === 'land',
						down.props.domain === 'land',
						leftDown.props.domain === 'land',
						left.props.domain === 'land',
						leftUp.props.domain === 'land'
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

	getBonusResourceName(tile){
		if(tile.hills)
			return 'ore';
		if(tile.mountains)
			return 'silver';

		if(tile.name === 'plains' && !tile.forest)
			return 'wheat';
		if(tile.name === 'grassland' && !tile.forest)
			return 'tobacco';
		if(tile.name === 'prairie' && !tile.forest)
			return 'cotton';
		if(tile.name === 'savannah' && !tile.forest)
			return 'sugar';

		if(tile.name === 'tundra' && tile.forest)
			return 'game';
		if(tile.name === 'prairie' && tile.forest)
			return 'game';
		if(tile.name === 'plains' && tile.forest)
			return 'fur';

		if(tile.name  === 'grassland' && tile.forest)
			return 'wood';
		if(tile.name  === 'savannah' && tile.forest)
			return 'wood';

		if(tile.name === 'desert')
			return 'oasis';

		if(tile.name === 'ocean')
			return 'fish';
		if(tile.name === 'coastal sea')
			return 'fish';

		return 'minerals';
	}

	renderBonusResources(center){
		let bonus = [];
		if(center && center.discovered && center.bonus){
			let resourceName = this.getBonusResourceName(center);
			bonus.push(Terrain.bonusResource[resourceName]);
		}

		return bonus;
	}

	renderTopTiles(center){
		let topTiles = [];
		if(center && center.discovered){
			let left = center.left();
			let right = center.right();
			let up = center.up();
			let down = center.down();

			if(left && right && up && down){			
				if(center.hills){
					let mod = this.getForestTileModifier(up.hills, right.hills, down.hills, left.hills);
					topTiles.push(Terrain.hills.singleTile + mod);
				}
				if(center.mountains){
					let mod = this.getForestTileModifier(up.mountains, right.mountains, down.mountains, left.mountains);
					topTiles.push(Terrain.mountains.singleTile + mod);
				}
				if(center.riverSmall){
					let mod = this.getForestTileModifier(up.riverSmall, right.riverSmall, down.riverSmall, left.riverSmall);
					topTiles.push(Terrain['small river'].singleTile + mod);
				}
				if(center.riverLarge){
					let mod = this.getForestTileModifier(up.riverLarge, right.riverLarge, down.riverLarge, left.riverLarge);
					topTiles.push(Terrain['large river'].singleTile + mod);
				}
				if(center.forest){
					let mod = this.getForestTileModifier(up.forest, right.forest, down.forest, left.forest);
					topTiles.push(Terrain.forest.singleTile + mod);
				}
			}

		}

		return topTiles;
	}

}

export default MapView;