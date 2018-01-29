import Colonize from 'src/colonize.js';

import SpriteRenderer from 'src/render/spriteRenderer.js';
import InputContext from 'src/input/context.js';
import UnitController from 'src/controller/unit.js';


class DebugView {
	constructor(){
		this.skipFrames = 1; //only update every x frames
		this.debug = true;

		DebugView.instance = this;
		
		this.currentFrame = this.skipFrames;
	}

	create(){
		game.time.advancedTiming = Colonize.instance.debug;
	}

    toggleDebugInfo(){
        this.debug = !this.debug && Colonize.instance.debug;
		game.debug.reset();
		this.currentFrame = this.skipFrames;
    }

	render(){
		if(this.debug){		
			if(this.currentFrame === this.skipFrames){
				let spriteCount = SpriteRenderer.instance.display.total;
				let spritesPerTile = Math.round(100*spriteCount / SpriteRenderer.instance.tileCount) / 100;
				let memoryUsage = 'n/a';
				let memoryLimit = 'n/a';
				let memoryPercentage = 'n/a';
				let unit = UnitController.instance.selectedUnit;
				let context = InputContext.instance.context;
				if(context === InputContext.NONE)
					context = 'None';
				if(context === InputContext.MAP)
					context = 'Map';
				if(context === InputContext.UNIT)
					context = 'Unit';
				if(context === InputContext.COLONY)
					context = 'Colony';
				if(context === InputContext.MODAL)
					context = 'modal';
				if(context === InputContext.UNLOAD)
					context = 'unload';
				if(typeof window.performance.memory !== 'undefined'){
					memoryUsage = window.performance.memory.usedJSHeapSize / (1000*1000);
					memoryLimit = window.performance.memory.jsHeapSizeLimit / (1000*1000);
					memoryPercentage = Math.round(100*memoryUsage/memoryLimit);
				}
				game.debug.start(20, 20, 'white');
				game.debug.line(game.time.fps + ' fps');
				game.debug.line(spriteCount + ' sprites');
				game.debug.line(SpriteRenderer.instance.tileCount + ' tiles');
				game.debug.line(spritesPerTile + ' sprites per tile (avg)');
				game.debug.line(SpriteRenderer.instance.spritesUpdated + ' sprites updated');
				game.debug.line(SpriteRenderer.instance.tileCache.numFrames + ' sprites in cache on ' + SpriteRenderer.instance.tileCache.renderTextures.length + ' textures');
				if(memoryUsage !=='n/a')
					game.debug.line('Using ' + memoryUsage + 'M of ' + memoryLimit + 'M (' + memoryPercentage + '%)');
				game.debug.line('Input context is ' + context);
				if(unit)
					game.debug.line(unit.name + ': ' + unit.movesLeft + '/' + unit.props.moves + ' moves');
				game.debug.stop();
				
				this.currentFrame = 0;
			}

			this.currentFrame++;
		}
	}
}


export default DebugView;