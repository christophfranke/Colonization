import Terrain from '../../data/terrain.json';
import Colonize from '../colonize.js';
import Yield from '../../data/yield.json';

class MapTile {
	constructor(props){
		this.id = props.id;
		this.position = props.position.getTile();

		if(Terrain.forest.id === props.top)
			this.forest = true;

		if(Terrain.hills.id === props.top)
			this.hills = true;

		if(Terrain.mountains.id === props.top){
			this.mountains = true;
		}
		if(Terrain.river.id === props.river){
			this.river = true;
		}
		if(Terrain.bonusRessource.id === props.bonus)
			this.bonus = true;

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
		};

		this.coastTerrain = null;
		this.mapBorder = (
			this.position.x === 0 ||
			this.position.y === 0 ||
			this.position.x === Colonize.map.mapData.numTiles.x-1 ||
			this.position.y === Colonize.map.mapData.numTiles.y-1);

		this.units = [];
	}

	getYield(colonist, type){
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

	getLeft(){
		return Colonize.map.mapData.getTileInfo(this.position.left());
	}

	getUp(){
		return Colonize.map.mapData.getTileInfo(this.position.up());
	}

	getRight(){
		return Colonize.map.mapData.getTileInfo(this.position.right());
	}

	getDown(){
		return Colonize.map.mapData.getTileInfo(this.position.down());
	}

	enter(unit){
		this.units.push(unit);
	}

	leave(unit){
		let index = this.units.indexOf(unit);
		this.units.splice(index, 1);
	}

	createCoastTerrain(){
		if(typeof this.props !== 'undefined' && this.props.domain === 'sea'){
			let left = Colonize.map.mapData.getTileInfo(this.position.left());
			let right = Colonize.map.mapData.getTileInfo(this.position.right());
			let up = Colonize.map.mapData.getTileInfo(this.position.up());
			let down = Colonize.map.mapData.getTileInfo(this.position.down());

			let landNeighbor = null;
			if(left !== null && typeof left.props !== 'undefined' && left.props.domain === 'land')
				landNeighbor = left;
			if(right !== null && typeof right.props !== 'undefined' && right.props.domain === 'land')
				landNeighbor = right;
			if(up !== null && typeof up.props !== 'undefined' && up.props.domain === 'land')
				landNeighbor = up;
			if(down !== null && typeof down.props !== 'undefined' && down.props.domain === 'land')
				landNeighbor = down;

			if(landNeighbor !== null)
				this.coastTerrain = landNeighbor.props;

			if(landNeighbor === null && left !== null && right !== null){
				let leftUp = left.getUp();
				let leftDown = left.getDown();
				let rightUp = right.getUp();
				let rightDown = right.getDown();

				if(leftUp !== null && typeof leftUp.props !== 'undefined' && leftUp.props.domain === 'land')
					landNeighbor = leftUp;
				if(leftDown !== null && typeof leftDown.props !== 'undefined' && leftDown.props.domain === 'land')
					landNeighbor = leftDown;
				if(rightUp !== null && typeof rightUp.props !== 'undefined' && rightUp.props.domain === 'land')
					landNeighbor = rightUp;
				if(rightDown !== null && typeof rightDown.props !== 'undefined' && rightDown.props.domain === 'land')
					landNeighbor = rightDown;

				if(landNeighbor !== null)
					this.coastTerrain = landNeighbor.props;
			}
		}

		if(this.coastTerrain)
			this.coast = true;
	}

	createCoastalSea(){
		this.isCoastalSea = false;
		if(typeof this.props !== 'undefined' && this.props.domain === 'sea' && this.coastTerrain === null){
			let left = Colonize.map.mapData.getTileInfo(this.position.left());
			let right = Colonize.map.mapData.getTileInfo(this.position.right());
			let up = Colonize.map.mapData.getTileInfo(this.position.up());
			let down = Colonize.map.mapData.getTileInfo(this.position.down());
			if(left !== null && right !== null){
				let leftUp = left.getUp();
				let leftDown = left.getDown();
				let rightUp = right.getUp();
				let rightDown = right.getDown();

				if(
					up !== null && rightUp !== null && right !== null && rightDown !== null &&
					down !== null && leftDown !== null && left !== null && leftUp !== null
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