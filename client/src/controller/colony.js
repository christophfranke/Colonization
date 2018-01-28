


class ColonyController{
	constructor(){
		ColonyController.instance = this;

		this.colonies = [];
	}

	addColony(colony){
		this.colonies.push(colony);
	}
}

export default ColonyController;