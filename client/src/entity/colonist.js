
import Units from '../../data/units.json';
import Colonize from '../colonize.js';


class Colonist{
	constructor(props){
		this.colony = props.colony;
		this.type = props.type;
		this.id = Units[this.type].id;

		this.production = null;
		this.expert = null;
	}

	workOn(tile){
		if(!tile)
			return false;

		if(tile.used)
			return false;

		if(tile === Colonize.map.getTileInfo(this.colony.position))
			return false;

		this.stopWorking()

		this.production = {
			tile: tile,
			type: 'food'
		};

		return true;
	}

	stopWorking(){
		if(this.production){
			this.production.tile.used = false;
			this.production = null;
		}
	}
}


export default Colonist;