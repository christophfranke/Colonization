

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
			return;
		}
		while(this.unit.movesLeft > 0){
			let position = this.path.pop().position;
			this.unit.makeMove(position);

			if(this.path.length === 0){
				this.unit.finalizeCommand();
				return;
			}
		}

	}

	endTurn(){
		this.execute();
	}
}


export default MoveCommand;