
import Colonize from './colonize.js';


class FPSCounter {
	constructor(props){

	}

	create(){
		Colonize.game.time.advancedTiming = true;
	}

	render(){

		Colonize.game.debug.text(Colonize.game.time.fps + ' fps' , 20, 30);
	}
}


export default FPSCounter;