
import Colonize from '../colonize.js';

class ColonyView {
	constructor(props){

		//load colony tilemap data into phaser cache
		// this.tileData = Colonize.game.cache.getJSON('colonyData');
		// Colonize.game.load.tilemap('colonyTilemap', null, this.tileData, Phaser.Tilemap.TILED_JSON)

    	//cretae tilemap
    	// this.tilemap = Colonize.game.add.tilemap('colonyTilemap');

    	//add tileset image
		// this.tilemap.addTilesetImage('colony', 'colonyTiles');

		//add layers
    	// this.backgroundLayer = this.tilemap.createLayer('background');
    	// this.buildingsLayer = this.tilemap.createLayer('buildings');
    	// this.terrainLayer = this.tilemap.createLayer('terrain');

    	// this.image = Colonize.game.add.image(0, 0, 'colonyScreen');
    	// this.image.scale = new Phaser.Point(0.5, 0.5 );
    	// this.image.fixedToCamera = true;
	}


}

export default ColonyView;