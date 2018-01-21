
import Colonize from '../colonize.js';
import MapTileView from '../view/mapTileView.js';

class FPSCounter {
	constructor(props){
		this.skipFrames = 1; //only update everey 30 frames
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
				let spritesPerTile = Math.round(100*Colonize.renderer.spriteCount / Colonize.renderer.tileCount) / 100;
				Colonize.game.debug.start(20, 20, 'white');
				Colonize.game.debug.line(Colonize.game.time.fps + ' fps');
				Colonize.game.debug.line(Colonize.renderer.spriteCount + ' sprites');
				Colonize.game.debug.line(Colonize.renderer.tileCount + ' tiles');
				Colonize.game.debug.line(spritesPerTile + ' sprites per tile (avg)');
				Colonize.game.debug.line(MapTileView.numLayers + '/' + Colonize.renderer.layers.length + ' layers per tile (max)');
				Colonize.game.debug.line(MapTileView.numTiles + ' sprites per tile (max)');
				Colonize.game.debug.stop();
				
				this.currentFrame = 0;
			}

			this.currentFrame++;
		}
	}
}


export default FPSCounter;