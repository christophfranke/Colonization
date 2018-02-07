import Options from 'data/options.json';

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

    centerAt(position){
		let cameraTarget = position.getScreen();
		cameraTarget.x -= 0.5 * game.width;
		cameraTarget.y -= 0.5 * game.height;

		return CameraController.instance.moveTo(cameraTarget);
    }
}

export default MapController;