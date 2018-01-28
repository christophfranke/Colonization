import UnitController from 'src/controller/unit.js';
import ColonyController from 'src/controller/colony.js';


class Turn{
	constructor(){
		Turn.instance = this;
		this.round = 0;
	}

	endTurn(){
		for(let unit of UnitController.instance.units){
			unit.nextTurn();
		}


		for(let colony of ColonyController.instance.colonies){
			colony.produce();
		}

		this.round++;

		UnitController.instance.selectNext();
	}
}

export default Turn;