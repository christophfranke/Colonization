import Places from '../data/places.json';

import TileSprite from './tileSprite.js';


class Colony{
	constructor(props){
		this.position = props.position.getTile();
		this.props = Places.colony;

		this.tileSprite = new TileSprite({
			id: this.props.id,
			position: this.position
		});
	}

	static found(position){
		Colony.all.push(new Colony({
			position: position
		}));
	}
}

Colony.all = [];


export default Colony;