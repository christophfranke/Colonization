import Position from 'src/utils/position.js';
import Map from 'src/model/entity/map.js';
import MapView from 'src/view/map/mapView.js';

import Phaser from 'phaser';

class MapController{
	constructor(){
		this.mapCenterTweenTime = 250; //also millis

        MapController.instance = this;
	}

	create(){
		this.map = new Map({
			data: game.cache.getJSON('mapData')
		});

		this.mapView = new MapView({
			map: this.map
		});
	}

	discover(tile){
		let info = this.map.getTileInfo(tile);
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

    centerAt(clickPosition){
		const cameraTarget = new Position({
			x: Math.floor(clickPosition.getWorld().x - 0.5*(game.width / game.camera.scale.x)),
			y: Math.floor(clickPosition.getWorld().y - 0.5*(game.height / game.camera.scale.y)),
			type: Position.WORLD
		});

		game.add.tween(game.camera).to( {
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

export default MapController;