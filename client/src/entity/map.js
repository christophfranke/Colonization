import TerrainProps from '../../data/terrain.json';
import Settings from '../../data/settings.json';

import Unit from './unit.js';
import Position from '../helper/position.js';
import MapData from '../world/mapData.js';
import Colonize from '../colonize.js';
import MapView from '../view/mapView.js';

class Map{
	constructor(props){
		this.holdTimeThreshold = 350; //millis
		this.mapCenterTweenTime = 250; //also millis
	}

	create(){
		this.mapData = new MapData({
			data: Colonize.game.cache.getJSON('mapData')
		});
		this.mapData.createCoastLine();

		this.mapView = new MapView({
			mapData: this.mapData
		});

		this.numTiles = this.mapData.numTiles;    	
	}

	discover(tile){
		let info = this.mapData.getTileInfo(tile);
		if(!info.discovered){
			info.discovered = true;
			this.mapView.updateTile(tile);
			this.mapView.updateTile(tile.up());
			this.mapView.updateTile(tile.left());
			this.mapView.updateTile(tile.down());
			this.mapView.updateTile(tile.right());
		}
	}

	getTileInfo(tile){
		return this.mapData.getTileInfo(tile);
	}


    centerAt(clickPosition){
		const cameraTarget = {
			x: Math.floor(clickPosition.getWorld().x - 0.5*(Colonize.game.width / Colonize.game.camera.scale.x)),
			y: Math.floor(clickPosition.getWorld().y - 0.5*(Colonize.game.height / Colonize.game.camera.scale.y))
		};

		Colonize.game.add.tween(Colonize.game.camera).to( {
				x: cameraTarget.x,
				y: cameraTarget.y
			},
			this.mapCenterTweenTime,
			Phaser.Easing.Cubic.Out,
			true,
			0,
			0,
			false
		);
    }
}

export default Map;