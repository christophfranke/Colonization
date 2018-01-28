import InputContext from 'src/input/context.js';
import Unit from 'src/model/entity/unit.js';

import MapController from './map.js';


class UnitController{
	constructor(){
		UnitController.instance = this;

		this.selectedUnit = null;
	}

	followUnit(unit){
		let screenPos = unit.position.getScreen();
		let margin = 0.15;
		if (!(
			screenPos.x > margin*game.width && 
			screenPos.x < (1-margin)*game.width &&
			screenPos.y > margin*game.height &&
			screenPos.y < (1-margin)*game.height
		)){
			MapController.instance.centerAt(unit.position);
		}
	}

	selectNext(){
		for(let u of Unit.all){
			if(u.movesLeft > 0 && !u.waiting && !u.isCargo){
				this.select(u);
				return;
			}
		}

		//no unit found: switch back to last Context
		this.unselect(this.selectedUnit);
		InputContext.instance.switch(InputContext.MAP);
	}

	select(unit){
		if(unit.movesLeft > 0){		
			if(this.selectedUnit !== null)
				this.unselect(this.selectedUnit);

			if(unit.isCargo){
				unit.teleport(unit.carryingUnit.position);
				unit.view.show();
			}

			this.selectedUnit = unit;
			unit.selected = true;
			unit.view.startBlinking();

			this.followUnit(unit);
			InputContext.instance.switch(InputContext.UNIT);
		}
	}

	unselect(unit){
		if(unit){		
			unit.selected = false;
			unit.view.stopBlinking();
			if(unit.isCargo)
				unit.view.hide();

			if(this.selectedUnit === unit)
				this.selectedUnit = null;
		}
	}


}

export default UnitController;