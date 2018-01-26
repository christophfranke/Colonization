import Colonize from 'src/colonize.js';
import Position from 'src/utils/position.js';
import ColonyView from 'src/view/colony/colonyView.js';
import Unit from 'src/model/entity/unit.js';


class PointerInput{
	constructor(){
		this.holdTimeThreshold = 350; //millis
		this.downAt = null;

		Colonize.game.canvas.oncontextmenu = (e) => { e.preventDefault(); };
    	Colonize.game.input.mouse.capture = true;
	}

	registerMapClick(layer){
    	layer.inputEnabled = true;
    	layer.events.onInputDown.add(this.inputDown, this);
    	layer.events.onInputUp.add(this.inputUp, this);

	}

	inputDown(){
		if(ColonyView.open !== null)
			ColonyView.open.hide();
		else
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