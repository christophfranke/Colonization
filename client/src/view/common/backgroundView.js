import PointerInput from 'src/input/pointer.js';


class BackgroundView {
	constructor(){
		this.background = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'undiscovered');
		
		PointerInput.instance.registerMapClick(this.background);
	}
}

export default BackgroundView;