import Places from '../../data/places.json';
import Ressources from '../../data/ressources.json';

import TileSprite from '../view/tileSprite.js';
import ColonyView from '../view/colonyView.js';
import Colonize from '../colonize.js';
import Colonist from './colonist.js';


class Colony{
	constructor(props){
		this.position = props.position.getTile();
		this.props = Places.colony;

		this.colonists = [new Colonist({
			colony: this,
			type: 'settler'
		})];

		this.storage = {};
		for(let type of Ressources.types){
			this.storage[type] = 0;
		}

		this.uncoverMap();

		this.colonyView = new ColonyView({
			id: this.props.id,
			colony: this
		});

		Colony.all.push(this);
	}

	uncoverMap(){
		let tile = this.position.getTile();

		//discover all tiles in radius 1
		for(let x = -1; x <= 1; x++){
			for(let y = -1; y <= 1; y++){
				tile.x = this.position.x + x;
				tile.y = this.position.y + y;
				Colonize.map.discover(tile);
			}
		}
	}

	produce(){
		for(let colonist of this.colonists){
			if(colonist.production){
				let type = colonist.production.type
				this.storage[type] += colonist.production.tile.getYield(type);
			}
		}
		this.colonyView.storageView.update();
	}

	openCityScreen(){
		this.colonyView.show();
	}
}

Colony.all = [];


export default Colony;