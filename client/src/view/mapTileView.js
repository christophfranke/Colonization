
import Colonize from '../colonize.js';


class MapTileView {
	constructor(props){
		this.indices = [];
		this.cached = null;
	}

	addTiles(indices){
		this.indices = [...this.indices, ...indices];
		if(this.indices.length > MapTileView.numTiles)
			MapTileView.numTiles = this.indices.length;
	}

	prepareForCaching(){
		if(this.cached !== null){
			console.log('Warning: can only prepare for caching once!');
		}
		else{
			this.cached = this.indices;
			this.indices = [];
		}
	}
}

MapTileView.numTiles = 0;

export default MapTileView;