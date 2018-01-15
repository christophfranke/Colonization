import Terrain from '../../data/terrain.json';
import Settings from '../../data/settings.json';

import MapTile from '../entity/mapTile.js';



class MapData{

	constructor(props){
		this.data = props.data;

		this.numTiles = {
			x: props.data.layers[0].width,
			y: props.data.layers[0].height
		};

		this.tiles = {};

		this.createAllTiles();
	}

	getTileInfo(position){
		const pos = position.getTile();
		const index = pos.x + this.numTiles.x * pos.y;

		if (index >= this.numTiles.x*this.numTiles.y)
			return null;

		if(typeof this.tiles[index] === 'undefined'){
			this.tiles[index] = new MapTile({
				id: this.data.layers[0].data[index]
			});
			console.log('should not happen anymore!');
		}

		return this.tiles[index];
	}

	getTilesetName(){
		return this.data.tilesets[0].name;
	}

	createAllTiles(){
		console.log('creating tiles');
		for(let index=0; index < this.numTiles.x*this.numTiles.y; index++){
			this.tiles[index] = new MapTile({
				id: this.data.layers[0].data[index]
			});
		}
		console.log('done');
	}
}

export default MapData;