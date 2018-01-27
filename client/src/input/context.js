

class InputContext{

	constructor(props){
		InputContext.instance = this;
		this.context = props.context;
		this.lastContext = props.context;
	}

	switch(newContext){
		if(newContext !== this.context){
			this.lastContext = this.context;
			this.context = newContext;
		}
	}

	switchBack(){
		this.context = this.lastContext;
	}


}


InputContext.MAP = 1;
InputContext.UNIT = 2;
InputContext.COLONY = 3;
InputContext.MODAL = 4;


export default InputContext;