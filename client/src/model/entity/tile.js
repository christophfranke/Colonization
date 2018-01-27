import Terrain from 'data/terrain.json';
import Yield from 'data/yield.json';
import Resources from 'data/resources.json';

import Position from 'src/utils/position.js';


class MapTile {
	constructor(props){
		this.id = props.id;
		this.position = props.position.getTile();
		this.map = props.map;

		this.forest = false;
		this.hills = false;
		this.mountains = false;
		this.riverLarge = false;
		this.riverSmall = false;
		this.river = false;
		this.bonus = false;

		if(Terrain.forest.id === props.top)
			this.forest = true;

		if(Terrain.hills.id === props.top)
			this.hills = true;

		if(Terrain.mountains.id === props.top){
			this.mountains = true;
		}
		if(Terrain['small river'].id === props.riverSmall){
			this.riverSmall = true;
		}
		if(Terrain['large river'].id === props.riverLarge)
			this.riverLarge = true;
		if(Terrain.bonusRessource.id === props.bonus)
			this.bonus = true;

		this.river = this.riverSmall || this.riverLarge;

		this.plowed = false;
		this.road = false;
		this.coast = false;


		this.discovered = true;
		this.used = false;

		for(let type in Terrain){
			if(Terrain[type].id === this.id){
				this.props = Terrain[type];
				this.name = type;
			}
		}

		this.coastTerrain = null;
		this.mapBorder = (
			this.position.x === 0 ||
			this.position.y === 0 ||
			this.position.x === this.map.numTiles.x-1 ||
			this.position.y === this.map.numTiles.y-1);

		this.units = [];
	}

	yield(colonist, type){
		let result = this.applyModifier(0, 'base', type);

		if(this.coast)
			result = this.applyModifier(result, 'coast', type);
		if(this.plowed)
			result = this.applyModifier(result, 'plowed', type);
		if(this.river)
			result = this.applyModifier(result, 'river', type);
		if(this.road)
			result = this.applyModifier(result, 'road', type);
		if(this.bonus)
			result = this.applyModifier(result, 'resource', type);
		if(colonist.expert === type)
			result = this.applyModifier(result, 'expert', type);

		return result;
	}

	applyModifier(base, name, type){
		let terrainName = this.terrainName();
		if(Yield[terrainName][type]){		
			let mod = Yield[terrainName][type][name];
			if(mod){
				if(mod[0] === '+')
					return base + parseFloat(mod.substr(1));
				if(mod[0] === '*')
					return base * parseFloat(mod.substr(1));

				return mod;
			}
		}

		return base;
	}

	terrainName(){
		let terrainName = this.name;

		if(this.forest)
			terrainName += 'WithForest';
		if(this.hills)
			terrainName = 'hills';
		if(this.mountains)
			terrainName = 'mountains';

		return terrainName;
	}

	ressourceProduction(colonist){
		let production = [];

		for(let resource of Resources.types){
			let amount = this.yield(colonist, resource);
			if(amount > 0)
				production.push({resource, amount});
		}

		return production;
	}

	left(){
		return this.map.getTileInfo(new Position({
			x: this.position.x-1,
			y: this.position.y,
			type: Position.TILE
		}));
	}

	up(){
		return this.map.getTileInfo(new Position({
			x: this.position.x,
			y: this.position.y-1,
			type: Position.TILE
		}));
	}

	right(){
		return this.map.getTileInfo(new Position({
			x: this.position.x+1,
			y: this.position.y,
			type: Position.TILE
		}));
	}

	down(){
		return this.map.getTileInfo(new Position({
			x: this.position.x,
			y: this.position.y+1,
			type: Position.TILE
		}));
	}

	enter(unit){
		this.units.push(unit);
	}

	leave(unit){
		let index = this.units.indexOf(unit);
		this.units.splice(index, 1);
	}

	decideCoastTerrain(){
		if(this.props && this.props.domain === 'sea'){
			let left = this.left();
			let right = this.right();
			let up = this.up();
			let down = this.down();

			let landNeighbor = null;
			if(left && left.props && left.props.domain === 'land')
				landNeighbor = left;
			if(right && typeof right.props !== 'undefined' && right.props.domain === 'land')
				landNeighbor = right;
			if(up && typeof up.props !== 'undefined' && up.props.domain === 'land')
				landNeighbor = up;
			if(down && typeof down.props !== 'undefined' && down.props.domain === 'land')
				landNeighbor = down;

			if(landNeighbor)
				this.coastTerrain = landNeighbor.props;

			if(landNeighbor === null && left && right){
				let leftUp = left.up();
				let leftDown = left.down();
				let rightUp = right.up();
				let rightDown = right.down();

				if(leftUp && typeof leftUp.props !== 'undefined' && leftUp.props.domain === 'land')
					landNeighbor = leftUp;
				if(leftDown && typeof leftDown.props !== 'undefined' && leftDown.props.domain === 'land')
					landNeighbor = leftDown;
				if(rightUp && typeof rightUp.props !== 'undefined' && rightUp.props.domain === 'land')
					landNeighbor = rightUp;
				if(rightDown && typeof rightDown.props !== 'undefined' && rightDown.props.domain === 'land')
					landNeighbor = rightDown;

				if(landNeighbor)
					this.coastTerrain = landNeighbor.props;
			}
		}

		if(this.coastTerrain)
			this.coast = true;
	}

	decideCoastalSea(){
		this.isCoastalSea = false;
		if(typeof this.props !== 'undefined' && this.props.domain === 'sea' && this.coastTerrain === null){
			let left = this.left();
			let right = this.right();
			let up = this.up();
			let down = this.down();
			if(left !== null && right !== null){
				let leftUp = left.up();
				let leftDown = left.down();
				let rightUp = right.up();
				let rightDown = right.down();

				if(
					up && rightUp && right && rightDown &&
					down && leftDown && left && leftUp
				){
				this.isCoastalSea =
					(up.coastTerrain !== null) ||
					(rightUp.coastTerrain !== null) ||
					(right.coastTerrain !== null) ||
					(rightDown.coastTerrain !== null) ||
					(down.coastTerrain !== null) ||
					(leftDown.coastTerrain !== null) ||
					(left.coastTerrain !== null) ||
					(leftUp.coastTerrain !== null);
				}
			}
		}

	}

}

export default MapTile;