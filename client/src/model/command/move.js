



class MoveCommand{
	constructor(props){
		this.unit = props.unit;
		this.to = props.to;
	}

	execute(){
		let unitPosition = this.unit.position.getTile();
		let position = this.to.position.getTile();
		if(
			Math.abs(unitPosition.x - position.x) <= 1 &&
			Math.abs(unitPosition.y - position.y) <= 1
		){
			if(this.unit.movesLeft > 0){
				this.unit.makeMove(position);
				this.unit.finalizeCommand();
			}
		}
		else{
			this.unit.cancelCommands();
		}
	}
}


export default MoveCommand;