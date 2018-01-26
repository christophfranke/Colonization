
import Colonize from 'src/colonize.js';
import MapTileView from 'src/view/common/mapTileView.js';

class FPSCounter {
	constructor(){
		this.skipFrames = 1; //only update every x frames
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
				let memoryUsage = 'n/a';
				let memoryLimit = 'n/a';
				let memoryPercentage = 'n/a';
				if(typeof window.performance.memory !== 'undefined'){
					memoryUsage = window.performance.memory.usedJSHeapSize / (1000*1000);
					memoryLimit = window.performance.memory.jsHeapSizeLimit / (1000*1000);
					memoryPercentage = Math.round(100*memoryUsage/memoryLimit);
				}
				Colonize.game.debug.start(20, 20, 'white');
				Colonize.game.debug.line(Colonize.game.time.fps + ' fps');
				Colonize.game.debug.line(Colonize.renderer.spriteCount + '/2000 sprites');
				Colonize.game.debug.line(Colonize.renderer.tileCount + ' tiles');
				Colonize.game.debug.line(spritesPerTile + ' sprites per tile (avg)');
				Colonize.game.debug.line(MapTileView.numTiles + ' sprites per tile (max)');
				Colonize.game.debug.line(Colonize.renderer.spritesUpdated + ' sprites updated');
				Colonize.game.debug.line(Colonize.renderer.tileCache.numFrames + '/' + Colonize.renderer.tileCache.cacheSize + ' sprites in cache');
				if(memoryUsage !=='n/a')
					Colonize.game.debug.line('Using ' + memoryUsage + 'M of ' + memoryLimit + 'M (' + memoryPercentage + '%)');
				Colonize.game.debug.stop();
				
				this.currentFrame = 0;
			}

			this.currentFrame++;
		}
	}
}


export default FPSCounter;