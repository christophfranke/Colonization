

class MoveCommand{
	constructor(props){
		this.unit = props.unit;
		this.from = this.unit.tile;
		this.to = props.to;

		if(this.to.isNextToOrDiagonal(this.from)){
			this.path = [this.to];
		}
		else{
			this.path = this.unit.map.shortestPath(this.to, this.from);
			if(this.path){
				this.path.pop();
				this.path = this.path.map((index) => {
						return this.unit.map.tiles[index];
					});
			}
		}
	}

	execute(){
		if(!this.path || this.path.length === 0){
			//somthing gone wrong
			this.unit.cancelCommand();
			
			return Promise.reject();
		}

		let promise = Promise.resolve();
		for(let i=0; i < this.path.length; i++){
			promise = promise.then(() => {

				if(this.unit.movesLeft > 0 && this.path.length > 0){					
					let position = this.path.pop().position;
					if(this.path.length === 0){
						this.unit.finalizeCommand();
					}
					return this.unit.makeMove(position);
				}
				else
					return Promise.resolve();
			});


		}

		return promise;
	}
}


export default MoveCommand;