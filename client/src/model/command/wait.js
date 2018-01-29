

class WaitCommand{
	constructor(props){
		if(props)
			this.unit = props.unit;
	}

	execute(){
		return Promise.resolve();
	}

	endTurn(){
		this.unit.finalizeCommand();
		return Promise.resolve();
	}
}

export default WaitCommand;