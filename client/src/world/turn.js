
import Unit from '../entity/unit.js';

class Turn{
	constructr(props){
		this.round = 0;
	}

	endTurn(){
		for(let u of Unit.all){
			u.nextTurn();
		}

		if(Unit.all.length > 0){
			Unit.all[0].select();
		}
	}
}

export default Turn;