import Options from 'data/options.json';

import Position from 'src/utils/position.js';
import Map from 'src/model/entity/map.js';

import CameraController from './camera.js';


class MapController{
	constructor(){
        MapController.instance = this;
	}

	create(){
		this.map = new Map({
			data: game.cache.getJSON(Options.map)
		});
	}

    centerAt(clickPosition){
		const cameraTarget = new Position({
			x: Math.floor(clickPosition.getWorld().x - 0.5*(game.width / game.camera.scale.x)),
			y: Math.floor(clickPosition.getWorld().y - 0.5*(game.height / game.camera.scale.y)),
			type: Position.WORLD
		});

		return CameraController.instance.moveTo(cameraTarget);
    }
}

export default MapController;