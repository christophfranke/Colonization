
import Unit from '../entity/unit.js';
import Colony from '../entity/colony.js';

class Turn{
	constructr(){
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
			Unit.all[0].select();
		}

		this.round++;
	}
}

export default Turn;