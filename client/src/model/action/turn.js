import UnitController from 'src/controller/unit.js';
import ColonyController from 'src/controller/colony.js';


class Turn{
	constructor(){
		Turn.instance = this;
		this.round = 0;
	}

	endTurn(){
		//finalize old turn
		for(let unit of UnitController.instance.units){
			unit.endTurnCommand();
		}

		//next round
		this.round++;

		//setup everythig for new turn
		for(let colony of ColonyController.instance.colonies){
			colony.produce();
		}
		for(let unit of UnitController.instance.units){
			unit.nextTurn();
		}

		//done.
		UnitController.instance.selectNext();
	}
}

export default Turn;