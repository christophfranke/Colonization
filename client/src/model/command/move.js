
import UnitController from 'src/controller/unit.js';

class MoveCommand{
	constructor(props){
		this.unit = props.unit;
		this.from = this.unit.tile;
		this.to = props.to;

		this.path = this.unit.map.path.findReverse(this.from, this.to, this.unit);
	}

	execute(){
		if(!this.path || this.path.length === 0){
			//somthing gone wrong
			this.unit.cancelCommand();
			return Promise.resolve();
		}

		let promise = Promise.resolve();
		for(let i=0; i < this.path.length; i++){
			promise = promise.then(() => {
				if(this.unit.movesLeft > 0 && this.path.length > 0){					
					let position = this.path.pop().position;
					if(this.path.length === 0){
						this.unit.finalizeCommand();
					}
					return new Promise((resolve) => {
						UnitController.instance.followUnit(this.unit).then(() => {
							this.unit.makeMove(position).then(()=>{
								resolve();
							});
						});
					});
				}
				else
					return Promise.resolve();
			});


		}

		return promise;
	}
}


export default MoveCommand;