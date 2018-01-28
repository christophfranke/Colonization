import UnitController from 'src/controller/unit.js';

import Unit from '../entity/unit.js';
import Colony from '../entity/colony.js';

class Turn{
	constructor(){
		Turn.instance = this;
		this.round = 0;
	}

	endTurn(){
		for(let u of Unit.all){
			u.nextTurn();
		}


		for(let c of Colony.all){
			c.produce();
		}

		if(Unit.all.length > 0){
			UnitController.instance.selectNext();
		}

		this.round++;
	}
}

export default Turn;