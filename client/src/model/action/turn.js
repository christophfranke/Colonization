import UnitController from 'src/controller/unit.js';
import ColonyController from 'src/controller/colony.js';

import Unit from '../entity/unit.js';

class Turn{
	constructor(){
		Turn.instance = this;
		this.round = 0;
	}

	endTurn(){
		for(let u of Unit.all){
			u.nextTurn();
		}


		for(let colony of ColonyController.instance.colonies){
			colony.produce();
		}

		if(Unit.all.length > 0){
			UnitController.instance.selectNext();
		}

		this.round++;
	}
}

export default Turn;