


class BoardShip{
	constructor(props){
		this.ship = ship;
		this.unit = unit;

		if(ship.canLoad()){
			ship.addCargo(this.unit);
			this.unit.view.hide();
		}
	}

	cancel(){
		ship.removeCargo(this.unit);
		this.uint.view.show();
	}


}


export default BoardShip;