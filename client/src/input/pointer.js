import Position from 'src/utils/position.js';
import UnitController from 'src/controller/unit.js';
import MapController from 'src/controller/map.js';

import InputContext from './context.js';


class PointerInput{
	constructor(){
		this.holdTimeThreshold = 350; //millis
		this.downAt = null;

		PointerInput.instance = this;

		game.canvas.oncontextmenu = (e) => { e.preventDefault(); };
    	game.input.mouse.capture = true;

		game.input.onDown.add(this.inputDown, this);
		game.input.onUp.add(this.inputUp, this);
	}

	inputDown(){
		this.isHolding = false;
		this.isDown = true;
		this.downContext = InputContext.instance.context;
		if(this.timeoutId)
			clearTimeout(this.timeoutId);

		if(InputContext.instance.context === InputContext.UNIT || InputContext.instance.context === InputContext.UNLOAD){		
			this.timeoutId = setTimeout(() => {
				this.inputStartHold();
			}, this.holdTimeThreshold);
		}
	}

	inputStartHold(){
		this.timeoutId = null;
		this.isHolding = true;
		game.canvas.style.cursor = 'crosshair';
	}

	inputUp(){
		const pointerPosition = new Position({
			x: game.input.activePointer.clientX,
			y: game.input.activePointer.clientY,
			type: Position.SCREEN
		});

		if(
			this.isDown &&
			(this.downContext === InputContext.UNIT ||
			this.downContext === InputContext.UNLOAD ||
			this.downContext === InputContext.MAP) &&
			(InputContext.instance.context === InputContext.UNIT ||
			InputContext.instance.context === InputContext.UNLOAD ||
			InputContext.instance.context === InputContext.MAP)
		){
			if(this.isHolding){
				UnitController.instance.orderMove(pointerPosition);
			}
			else{
				MapController.instance.centerAt(pointerPosition);
			}
		}

		if(this.timeoutId)
			clearTimeout(this.timeoutId);

		this.isHolding = false;
		this.isDown = false;
		this.timeoutId = null;
		
		game.canvas.style.cursor = 'default';
	}
}


export default PointerInput;