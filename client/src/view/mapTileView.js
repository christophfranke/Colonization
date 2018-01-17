


class MapTileView {
	constructor(props){
		this.reset();
	}

	newLayer(){
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
}

MapTileView.numLayers = 0;
MapTileView.numTiles = 0;

export default MapTileView;