
import Colonize from '../colonize.js';


class MapTileView {
	constructor(props){
		this.reset();
	}

	newLayer(){
		//no more layers left
		if(this.layers.length === Colonize.renderer.layers.length)
			return;

		//last layer is empty, no new layer needed
		if(this.layers[this.layers.length-1].length === 0)
			return;

		this.layers.push([]);
		if(this.layers.length > MapTileView.numLayers)
			MapTileView.numLayers = this.layers.length;
	}

	addTiles(indices){
		this.layers[this.layers.length-1] = [...this.layers[this.layers.length-1], ...indices];
		this.numTiles += indices.length;
		if(this.numTiles > MapTileView.numTiles)
			MapTileView.numTiles = this.numTiles;
	}

	reset(){
		this.layers = [[]];
		this.numTiles = 0;
	}

	getIndices(){
		let indices = [];
		for(let layer of this.layers){
			for(let tile of layer){
				indices.push(tile);
			}
		}

		return indices;
	}
}

MapTileView.numLayers = 1;
MapTileView.numTiles = 0;

export default MapTileView;