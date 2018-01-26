import Units from 'data/units.json';


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

		if(tile === this.colony.map.getTileInfo(this.colony.position))
			return false;

		this.stopWorking();
		if(this.production)
			this.production.tile = tile;
		else
			this.production = {
				tile: tile
			};

		return true;
	}

	stopWorking(){
		if(this.production){
			this.production.tile.used = false;
			this.production.tile = null;
		}
	}

	selectProduction(choice){
		if(this.production){
			this.production.resource = choice.resource;
		}
		if(this.productionView)
			this.productionView.setProduction(this.production.tile.getYield(this, this.production.resource), this.production.resource);
	}
}


export default Colonist;