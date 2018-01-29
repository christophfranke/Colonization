

class WaitCommand{
	constructor(props){
		if(props)
			this.unit = props.unit;
	}

	endTurn(){
		this.unit.finalizeCommand();
	}
}

export default WaitCommand;