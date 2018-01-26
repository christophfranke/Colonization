import Global from 'src/global.js';

import Tile from 'src/model/entity/tile.js';
import Position from 'src/utils/position.js';


class Map{

	constructor(props){
		this.data = props.data;

		this.baseLayer = this.getLayer('terrain base');
		this.topLayer = this.getLayer('terrain top');
		this.riverSmallLayer = this.getLayer('terrain river small');
		this.riverLargeLayer = this.getLayer('terrain river large');
		this.bonusLayer = this.getLayer('terrain bonus');

		this.numTiles = {
			x: this.baseLayer.width,
			y: this.baseLayer.height,
		};
		this.numTiles.total = this.numTiles.x*this.numTiles.y;

		Global.register('map', this);

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
		const index = pos.x + this.numTiles.x * pos.y;

		if (index < 0 || index >= this.numTiles.x*this.numTiles.y)
			return null;

		return this.tiles[index];
	}

	createAllTiles(){
		this.tiles = {};

		//create tiles
		for(let index=0; index < this.numTiles.x*this.numTiles.y; index++){
			this.tiles[index] = new Tile({
				id: this.baseLayer.data[index],
				top: this.topLayer.data[index],
				riverSmall: this.riverSmallLayer.data[index],
				riverLarge: this.riverLargeLayer.data[index],
				bonus: this.bonusLayer.data[index],
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
		for(let index=0; index < this.numTiles.x*this.numTiles.y; index++){
			this.tiles[index].createCoastalSea();
		}		
	}
}

export default Map;