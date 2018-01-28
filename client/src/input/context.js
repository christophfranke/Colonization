

class InputContext{

	constructor(props){
		InputContext.instance = this;
		this.context = props.context;
		this.pastContexts = [];
	}

	switch(newContext){
		if(newContext !== this.context){
			if(this.context === InputContext.NONE){
				this.clearHistory(); //you cannot put context NONE in history.
			}
			else{			
				this.pastContexts.push(this.context);
			}
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

InputContext.NONE = 0;
InputContext.MAP = 1;
InputContext.UNIT = 2;
InputContext.COLONY = 3;
InputContext.MODAL = 4;


export default InputContext;