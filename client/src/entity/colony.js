import Places from '../../data/places.json';

import TileSprite from '../view/tileSprite.js';
import ColonyView from '../view/colonyView.js';
import Colonize from '../colonize.js';


class Colony{
	constructor(props){
		this.position = props.position.getTile();
		this.props = Places.colony;

		this.uncoverMap();

		this.colonyView = new ColonyView({
			id: this.props.id,
			position: this.position
		});
	}

	static found(position){
		Colony.all.push(new Colony({
			position: position
		}));
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

	openCityScreen(){
		this.colonyView.show();
	}
}

Colony.all = [];


export default Colony;