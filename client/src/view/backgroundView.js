

import Colonize from '../colonize.js';
import Settings from '../../data/settings.json';


class BackgroundView {
	constructor(props){
		let worldDimensions = {
			x: Colonize.map.mapData.numTiles.x*Settings.tileSize.x,
			y: Colonize.map.mapData.numTiles.y*Settings.tileSize.y
		}
		Colonize.game.world.resize(worldDimensions.x, worldDimensions.y);

		let imageDimensions = {
			x: 1024,
			y: 1024
		};

		for(let x = 0; x*imageDimensions.x < worldDimensions.x; x++){
			for(let y = 0; y*imageDimensions.y < worldDimensions.y; y++){
				Colonize.game.add.image(x*imageDimensions.x, y*imageDimensions.y, 'undiscovered');
			}
		}

	}
}

export default BackgroundView;