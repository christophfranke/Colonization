
import Colonize from '../colonize.js';


class MapTileView {
	constructor(props){
		this.indices = [];
	}

	addTiles(indices){
		this.indices = [...this.indices, ...indices];
		if(this.indices.length > MapTileView.numTiles)
			MapTileView.numTiles = this.indices.length;
	}
}

MapTileView.numLayers = 1;
MapTileView.numTiles = 0;

export default MapTileView;