import Places from 'data/places.json';
import Resources from 'data/resources.json';

import ColonyView from 'src/view/colony/colonyView.js';
import ColonyController from 'src/controller/colony.js';

import Colonist from './colonist.js';
import Map from './map.js';


class Colony{
	constructor(props){
		this.position = props.position.getTile();
		this.props = Places.colony;
		this.map = props.map || Map.instance;

		this.colonists = [new Colonist({
			colony: this,
			type: 'settler'
		})];

		this.storage = {};
		for(let type of Resources.types){
			this.storage[type] = 0;
		}

		this.uncoverMap();

		this.colonyView = new ColonyView({
			id: this.props.id,
			colony: this
		});

		ColonyController.instance.addColony(this);
	}

	uncoverMap(){
		let tile = this.position.getTile();

		//discover all tiles in radius 1
		for(let x = -1; x <= 1; x++){
			for(let y = -1; y <= 1; y++){
				tile.x = this.position.x + x;
				tile.y = this.position.y + y;
				this.map.discover(tile);
			}
		}
	}

	produce(){
		for(let colonist of this.colonists){
			if(colonist.production){
				let resource = colonist.production.resource;
				this.storage[resource] += colonist.production.tile.yield(colonist, resource);
			}
		}
		this.colonyView.storageView.update();
	}

}


export default Colony;