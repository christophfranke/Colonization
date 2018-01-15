
import Colonize from '../colonize.js';


class FPSCounter {
	constructor(props){
		this.skipFrames = 30; //only update everey 30 frames
		this.debug = false;
		
		this.currentFrame = this.skipFrames;
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
				Colonize.game.debug.start(20, 20, 'white');
				Colonize.game.debug.line(Colonize.game.time.fps + ' fps');
				Colonize.game.debug.stop();
				
				this.currentFrame = 0;
			}

			this.currentFrame++;
		}
	}
}


export default FPSCounter;