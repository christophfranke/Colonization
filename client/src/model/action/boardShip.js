
import SleepCommand from 'src/model/command/sleep.js';


class BoardShipAction{
	constructor(props){
		this.ship = props.ship;
		this.unit = props.unit;

		if(this.ship.canLoad()){
			this.ship.addCargo(this.unit);
			this.unit.view.hide();
			this.unit.isCargo = true;
			this.unit.ship = this.ship;
			this.unit.makeMove(this.ship.position);
			this.unit.issueCommand(new SleepCommand({
				unit: this.unit
			}));
		}
	}

	unload(){
		this.ship.removeCargo(this.unit);
		this.unit.view.show();
		this.unit.isCargo = false;
		this.unit.ship = null;
	}


}


export default BoardShipAction;