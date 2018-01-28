import Position from 'src/utils/position.js';
import ColonyView from 'src/view/colony/colonyView.js';
import UnitController from 'src/controller/unit.js';
import MapController from 'src/controller/map.js';


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
		if(ColonyView.open === null)
			this.downAt = game.time.now;
	}

	inputUp(){
		const pointerPosition = new Position({
			x: game.input.activePointer.clientX,
			y: game.input.activePointer.clientY,
			type: Position.SCREEN
		});

		if(this.downAt !== null){		
			const downTime = game.time.now - this.downAt;
			this.downAt = null;

			if(downTime > this.holdTimeThreshold){
				UnitController.instance.orderMove(pointerPosition);
			}
			else{
				MapController.instance.centerAt(pointerPosition);
			}
		}
	}
}


export default PointerInput;