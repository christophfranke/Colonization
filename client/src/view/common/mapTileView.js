


class MapTileView {
	constructor(){
		this.reset();
	}

	addCacheLayer(){
		this.layers.push([]);
	}

	addTiles(indices){
		this.layers[this.layers.length-1] = [...this.layers[this.layers.length-1], ...indices];
		this.indices = [...this.indices, ...indices];
		this.numTiles += indices.length;
		if(this.numTiles > MapTileView.numTiles)
			MapTileView.numTiles = this.numTiles;
	}

	reset(){
		this.layers = [[]];
		this.indices = [];
		this.numTiles = 0;
	}
}

MapTileView.equals = (a, b) => {
	if(!a || !b)
		return false;
	
	if(a.indices.length !== b.indices.length)
		return false;

	for(let i=0; i < a.indices.length; i++){
		if(a.indices[i] !== b.indices[i]){
			return false;
		}
	}

	return true;
};

MapTileView.numTiles = 0;

export default MapTileView;
