import Terrain from 'data/terrain.json';
import Terrain2 from 'data/terrain2.json';
import Yield from 'data/yield.json';
import Resources from 'data/resources.json';
import Options from 'data/options.json';

import Position from 'src/utils/position.js';


class MapTile {
	constructor(props){
		this.id = props.id;
		this.position = props.position.getTile();
		this.map = props.map;
		this.index = props.index;

		this.forest = false;
		this.hills = false;
		this.mountains = false;
		this.riverLarge = false;
		this.riverSmall = false;
		this.river = false;
		this.bonus = false;

		for(let type in Terrain){
			if(Terrain[type].id === this.id){
				this.props = Terrain[type];
				this.name = type;
			}
		}
		if(!this.props){
			console.warn('No terrain type found for id', this.id, this.position, 'defaulting to ocean tile');
			this.props = Terrain.ocean;
			this.name = 'ocean';
		}


		if(this.props.domain === 'land'){		
			if(Terrain.forest.id === props.top)
				this.forest = true;

			if(Terrain.hills.id === props.top)
				this.hills = true;

			if(Terrain.mountains.id === props.top){
				this.mountains = true;
			}
		}
		if(Terrain['small river'].id === props.riverSmall){
			this.riverSmall = true;
		}
		if(Terrain['large river'].id === props.riverLarge)
			this.riverLarge = true;

		if(Terrain.bonusResource.id === props.bonus)
			this.bonus = true;

		this.river = this.riverSmall || this.riverLarge;

		this.plowed = false;
		this.road = false;
		this.coast = false;


		this.discovered = Options.discovered;
		this.used = false;


		this.coastTerrain = null;
		this.isBorderTile = (
			this.position.x === 0 ||
			this.position.y === 0 ||
			this.position.x === this.map.numTiles.x-1 ||
			this.position.y === this.map.numTiles.y-1);

		this.colony = null;
		this.units = [];
	}

	yield(type, colonist){
		let where = 'colony';
		if(colonist)
			where = 'field';

		let result = this.applyModifier(0, 'base', type, where);

		if(this.coast)
			result = this.applyModifier(result, 'coast', type, where);
		if(this.plowed)
			result = this.applyModifier(result, 'plowed', type, where);
		if(this.river)
			result = this.applyModifier(result, 'river', type, where);
		if(this.road)
			result = this.applyModifier(result, 'road', type, where);
		if(this.bonus)
			result = this.applyModifier(result, 'resource', type, where);
		if(colonist && colonist.expert === type)
			result = this.applyModifier(result, 'expert', type, where);

		return result;
	}

	indexString(){
		return '' + this.index;
	}

	movementCost(from){
		if(from === this)
			return 0;

		if(from.props.domain === 'land' && from.river && this.river && this.isNextTo(from)){
			return 0.334;
		}

		if(from.road && this.road && this.isNextTo(from))
			return 0.334;

		return Terrain2[this.terrainName()].movementCost;
	}

	isNextTo(other){
		let pos1 = this.position.getTile();
		let pos2 = other.position.getTile();

		//next to each other but not diagonal
		return Math.abs(pos1.x-pos2.x) + Math.abs(pos1.y-pos2.y) <= 1.1;
	}

	isNextToOrDiagonal(other){
		let pos1 = this.position.getTile();
		let pos2 = other.position.getTile();

		//next to each other but not diagonal
		return Math.abs(pos1.x-pos2.x) <= 1.1 && Math.abs(pos1.y-pos2.y) <= 1.1;
	}

	applyModifier(base, name, type, where){
		let terrainName = this.terrainName();
		if(Yield[terrainName][where][type]){		
			let mod = Yield[terrainName][where][type][name];
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

	resourceProduction(colonist){
		let production = [];

		for(let resource of Resources.types){
			let amount = this.yield(resource, colonist);
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

	neighbors(){
		return [
			this.up(),
			this.right().up(),
			this.right(),
			this.right().down(),
			this.down(),
			this.left().down(),
			this.left(),
			this.left().up()
		];
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