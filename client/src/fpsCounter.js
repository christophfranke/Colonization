
import Colonize from './colonize.js';


class FPSCounter {
	constructor(props){
		this.skipFrames = 30;
		this.currentFrame = this.skipFrames;
		this.debug = false;
	}

	create(){
		Colonize.game.time.advancedTiming = Colonize.instance.debug;
	}

    toggleDebugInfo(){
        this.debug = !this.debug && Colonize.instance.debug;
		Colonize.game.debug.reset();
		this.currentFrame = this.skipFrames;
    }


	render(){
		if(this.debug){		
			if(this.currentFrame == this.skipFrames){
				Colonize.game.debug.text('Hallo Welt', 20, 20);
				Colonize.game.debug.text(Colonize.game.time.fps + ' fps' , 20, 40);
				this.currentFrame = 0;
			}

			this.currentFrame++;
		}
	}
}


export default FPSCounter;