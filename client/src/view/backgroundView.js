

import Colonize from '../colonize.js';
import Settings from '../../data/settings.json';


class BackgroundView {
	constructor(props){
		let worldDimensions = {
			x: Colonize.map.mapData.numTiles.x*Settings.tileSize.x,
			y: Colonize.map.mapData.numTiles.y*Settings.tileSize.y
		}
		Colonize.game.world.resize(worldDimensions.x, worldDimensions.y);

		this.background = Colonize.game.add.tileSprite(0, 0, worldDimensions.x, worldDimensions.y, 'undiscovered');
		
		Colonize.pointerInput.registerClickLayer(this.background);
	}
}

export default BackgroundView;