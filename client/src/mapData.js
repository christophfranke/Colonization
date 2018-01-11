import Terrain from '../data/terrain.json';
import Settings from '../data/settings.json';

import MapTile from './mapTile.js';



class MapData{

	constructor(props){
		this.data = props.data;

		this.numTiles = {
			x: props.data.layers[0].width,
			y: props.data.layers[0].height
		};
	}

	getTileInfo(position){
		const pos = position.getTile();
		const index = pos.x + this.numTiles.x * pos.y;

		if (index >= this.numTiles.x*this.numTiles.y)
			return null;

		return new MapTile({
			id: this.data.layers[0].data[index]
		});

	}
}

export default MapData;