import Settings from '../../data/settings.json';

import MapTile from '../entity/mapTile.js';
import Position from '../helper/position.js';


class MapData{

	constructor(props){
		this.data = props.data;

		this.baseLayer = this.getLayer('terrain base');
		this.topLayer = this.getLayer('terrain top');
		this.riverLayer = this.getLayer('terrain river');

		this.numTiles = {
			x: this.baseLayer.width,
			y: this.baseLayer.height,
		};
		this.numTiles.total = this.numTiles.x*this.numTiles.y;
	}

	init(){
		this.createAllTiles();
		this.createCoastLine();
	}

	getLayer(name){
		for(let layer of this.data.layers){
			if(layer.name === name)
				return layer;
		}
	}

	getTileInfo(position){
		const pos = position.getTile();
		const index = pos.x + this.numTiles.y * pos.y;

		if (index < 0 || index >= this.numTiles.x*this.numTiles.y)
			return null;

		return this.tiles[index];
	}

	createAllTiles(){
		let data = this.data;
		this.tiles = {}

		//create tiles
		for(let index=0; index < this.numTiles.x*this.numTiles.y; index++){
			this.tiles[index] = new MapTile({
				id: this.baseLayer.data[index],
				top: this.topLayer.data[index],
				river: this.riverLayer.data[index],
				position: new Position({
					x: index % this.numTiles.x,
					y: index / this.numTiles.x,
					type: Position.TILE
				})
			});
		}
	}

	createCoastLine(){
		//look for coasts and create coast lines
		for(let index=0; index < this.numTiles.x*this.numTiles.y; index++){
			this.tiles[index].createCoastTerrain();
		}		
	}
}

export default MapData;