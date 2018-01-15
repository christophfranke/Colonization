import Colonize from '../colonize.js';
import Position from '../helper/position.js';


class PointerInput{
	constructor(props){
		this.downAt = null;

		Colonize.game.canvas.oncontextmenu = (e) => { e.preventDefault(); };
    	Colonize.game.input.mouse.capture = true;

    	Colonize.map.topLayer.inputEnabled = true;
    	Colonize.map.topLayer.events.onInputDown.add(this.inputDown, this);
    	Colonize.map.topLayer.events.onInputUp.add(this.inputUp, this);
	}

	inputDown(){
		this.downAt = Colonize.game.time.now;
	}

	inputUp(){
		const pointerPosition = new Position({
			x: Colonize.game.input.activePointer.clientX,
			y: Colonize.game.input.activePointer.clientY,
			type: Position.SCREEN
		});

		if(this.downAt !== null){		
			const downTime = Colonize.game.time.now - this.downAt;
			this.downAt = null;

			if(downTime > this.holdTimeThreshold){
				if(Unit.selectedUnit !== null){
					Unit.selectedUnit.orderMoveTo(pointerPosition);
				}
			}
			else{
				Colonize.map.centerAt(pointerPosition);
			}
		}
	}
}


export default PointerInput;