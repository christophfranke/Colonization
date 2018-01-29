
import Colony from 'src/model/entity/colony.js';


class FoundColonyCommand{
	constructor(props){
		if(props)
			this.unit = props.unit;
	}

	execute(){
		if(this.unit.props.canFound){

			//check this field for existing colony
			if(this.unit.tile.colony){
				this.unit.cancelCommand();
				return Promise.resolve();
			}

			//check neighbor fields
			for(let tile of this.unit.tile.neighbors()){
				// console.log(tile);
				if(tile.colony){
					this.unit.cancelCommand();
					return Promise.resolve();
				}
			}

			//ok, can found
			this.unit.tile.colony = new Colony({
				position: this.unit.position,
				founder: this.unit
			});
			this.unit.disband();
		}

		this.unit.finalizeCommand();
		return Promise.resolve();
	}

}

export default FoundColonyCommand;