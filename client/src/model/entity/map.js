import Tile from 'src/model/entity/tile.js';
import Position from 'src/utils/position.js';
import MapView from 'src/view/map/mapView.js';

import Graph from 'node-dijkstra';

class Map{

	constructor(props){
		console.log('creating map');
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

		Map.instance = this;

		console.log('creating tiles');
		this.createAllTiles();
		console.log('creating coast line');
		this.createCoastLine();
		console.log('creating graph');
		this.createGraph();

		console.log('creating view');
		this.view = new MapView({
			map: this
		});

		console.log('map created.');
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

	discover(position){
		let tile = this.getTileInfo(position);
		if(!tile.discovered){
			tile.discovered = true;

			this.view.updateTile(tile);
		}
	}

	createAllTiles(){
		this.tiles = {};

		//create tiles
		for(let index=0; index < this.numTiles.x*this.numTiles.y; index++){
			this.tiles[index] = new Tile({
				id: this.baseLayer.data[index],
				index: index,
				top: this.topLayer.data[index],
				riverSmall: this.riverSmallLayer.data[index],
				riverLarge: this.riverLargeLayer.data[index],
				bonus: this.bonusLayer.data[index],
				position: new Position({
					x: index % this.numTiles.x,
					y: index / this.numTiles.x,
					type: Position.TILE
				}),
				map: this
			});
		}
	}

	createCoastLine(){
		//look for coasts and create coast lines
		for(let index=0; index < this.numTiles.total; index++){
			this.tiles[index].decideCoastTerrain();
		}		
		for(let index=0; index < this.numTiles.total; index++){
			this.tiles[index].decideCoastalSea();
		}		
	}

	shortestPath(from, to){
		return this.graph.path(from.indexString(), to.indexString());
	}

	createGraph(){
		this.graph = new Graph();
		for(let index=0; index < this.numTiles.total; index++){
			let center = this.tiles[index];
			let neighbors = {};
			if(!center.isBorderTile){			
				let up = center.up();
				let rightUp = up.right();
				let right = center.right();
				let rightDown = right.down();
				let down = center.down();
				let leftDown = down.left();
				let left = center.left();
				let leftUp = left.up();


				if(up.props.domain === center.props.domain)
					neighbors[up.indexString()] = up.movementCost(center);
				if(rightUp.props.domain === center.props.domain)
					neighbors[rightUp.indexString()] = rightUp.movementCost(center) + 0.01;
				if(right.props.domain === center.props.domain)
					neighbors[right.indexString()] = right.movementCost(center);
				if(rightDown.props.domain === center.props.domain)
					neighbors[rightDown.indexString()] = rightDown.movementCost(center) + 0.01;
				if(down.props.domain === center.props.domain)
					neighbors[down.indexString()] = down.movementCost(center);
				if(leftDown.props.domain === center.props.domain)
					neighbors[leftDown.indexString()] = leftDown.movementCost(center) + 0.01;
				if(left.props.domain === center.props.domain)
					neighbors[left.indexString()] = left.movementCost(center);
				if(leftUp.props.domain === center.props.domain)
					neighbors[leftUp.indexString()] = leftUp.movementCost(center) + 0.01;
			}

			this.graph.addNode(center.indexString(), neighbors);
		}
	}
}

export default Map;