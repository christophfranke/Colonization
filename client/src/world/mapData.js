import Settings from '../../data/settings.json';

import MapTile from '../entity/mapTile.js';
import Position from '../helper/position.js';


class MapData{

	constructor(props){
		this.numTiles = {
			x: props.data.layers[0].width,
			y: props.data.layers[0].height
		};

		this.createAllTiles(props.data);
	}

	getTileInfo(position){
		const pos = position.getTile();
		const index = pos.x + this.numTiles.y * pos.y;

		if (index >= this.numTiles.x*this.numTiles.y)
			return null;

		return this.tiles[index];
	}

	createAllTiles(data){
		this.tiles = {}
		for(let index=0; index < this.numTiles.x*this.numTiles.y; index++){
			this.tiles[index] = new MapTile({
				id: data.layers[0].data[index],
				top: data.layers[7].data[index],
				position: new Position({
					x: index % this.numTiles.y,
					y: index / this.numTiles.y,
					type: Position.TILE
				})
			});
		}
	}
}

export default MapData;