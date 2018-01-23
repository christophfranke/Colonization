
import Units from '../../data/units.json';


class Colonist{
	constructor(props){
		this.colony = props.colony;
		this.type = props.type;
		this.id = Units[this.type].id;

		this.production = null;
	}

	workOn(tile){
		if(!tile){
			this.stopWorking();
			return true;
		}

		if(tile.used)
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