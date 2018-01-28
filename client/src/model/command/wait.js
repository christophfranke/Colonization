

class WaitCommand{
	constructor(props){
		if(props)
			this.unit = props.unit;
	}

	execute(){
	}

	endTurn(){
		this.unit.finalizeCommand();
	}
}

export default WaitCommand;