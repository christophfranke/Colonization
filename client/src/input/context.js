

class InputContext{

	constructor(props){
		InputContext.instance = this;
		this.context = props.context;
		this.pastContexts = [];
	}

	switch(newContext){
		if(newContext !== this.context){
			this.pastContexts.push(this.context);
			this.context = newContext;
		}
	}

	switchBack(){
		if(this.pastContexts.length > 0){
			this.context = this.pastContexts.pop();
		}

	}

	clearHistory(){
		this.pastContexts = [];
	}


}


InputContext.MAP = 1;
InputContext.UNIT = 2;
InputContext.COLONY = 3;
InputContext.MODAL = 4;


export default InputContext;