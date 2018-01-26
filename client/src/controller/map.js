import Position from 'src/utils/position.js';
import MapData from 'src/model/entity/map.js';
import Colonize from 'src/colonize.js';
import MapView from 'src/view/map/mapView.js';

import Phaser from 'phaser';

class Map{
	constructor(){
		this.mapCenterTweenTime = 250; //also millis
	}

	create(){
		this.mapData = new MapData({
			data: Colonize.game.cache.getJSON('mapData')
		});

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
			this.mapView.updateTile(tile.up().left());
			this.mapView.updateTile(tile.up().right());
			this.mapView.updateTile(tile.down().left());
			this.mapView.updateTile(tile.down().right());
		}
	}

	getTileInfo(tile){
		return this.mapData.getTileInfo(tile);
	}


    centerAt(clickPosition){
		const cameraTarget = new Position({
			x: Math.floor(clickPosition.getWorld().x - 0.5*(Colonize.game.width / Colonize.game.camera.scale.x)),
			y: Math.floor(clickPosition.getWorld().y - 0.5*(Colonize.game.height / Colonize.game.camera.scale.y)),
			type: Position.WORLD
		});

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