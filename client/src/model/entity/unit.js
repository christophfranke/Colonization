import UnitProps from 'data/units.json';

import Position from 'src/utils/position.js';
import UnitView from 'src/view/map/unitView.js';
import Map from 'src/model/entity/map.js';
import UnitController from 'src/controller/unit.js';

import Colony from './colony.js';


class Unit{

	constructor(props){
		this.name = props.name;
		this.position = new Position({
			x: props.position.x,
			y: props.position.y,
			type: props.position.type
		});
		this.map = props.map || Map.instance;

		this.props = UnitProps[this.name];

		this.view = new UnitView({
			id: this.props.id,
			position: this.position
		});

		this.view.sprite.inputEnabled = true;
		this.view.sprite.events.onInputDown.add(() => {
			UnitController.instance.click(this);
		});

		this.movesLeft = this.props.moves;
		this.isUnit = true;
		this.isCargo = false;
		this.carryingUnit = null;
		if(typeof this.props.cargo !== 'undefined' && this.props.cargo > 0)
			this.cargo = new Array(this.props.cargo).fill(null);
		else
			this.cargo = [];

		this.tileInfo = this.map.getTileInfo(this.position);
		this.tileInfo.enter(this);
		this.uncoverMap();

		this.commands = [];

		UnitController.instance.addUnit(this);
	}


	getCargoUnit(){
		for(let c of this.cargo){
			if(c !== null)
				return c;
		}

		return null;
	}

	becomeCargo(unit){
		this.isCargo = true;
		this.carryingUnit = unit;
		this.view.hide();

		unit.addCargo(this);

		UnitController.instance.selectNext();
	}

	stopBeingCargo(){
		if(this.isCargo){
			this.isCargo = false;
			this.carryingUnit.removeCargo(this);
			this.carryingUnit = null;
			this.view.show();
		}
	}

	addCargo(cargo){
		for(let i=0; i < this.cargo.length; i++){
			if(this.cargo[i] === null){
				this.cargo[i] = cargo;
				return;
			}
		}
	}

	removeCargo(cargo){
		let index = this.cargo.indexOf(cargo);
		this.cargo[index] = null;
	}


	orderFoundColony(){
		if(this.props.canFound){
			new Colony({
				position: this.position,
				founder: this
			});
			this.movesLeft = 0;
			UnitController.instance.selectNext();
			this.disband();
		}
	}

	issueCommand(command){
		command.unit = this;
		this.commands.push(command);
		this.executeCommand();
	}

	cancelCommand(){
		this.clearCommands();
	}

	clearCommands(){
		this.commands = [];
	}

	finalizeCommand(){
		this.commands = this.commands.slice(1); //remove first command
	}

	executeCommand(){
		if(this.hasCommands())
			this.commands[0].execute();
	}

	hasCommands(){
		return this.commands.length > 0;
	}

	endTurnCommand(){
		if(this.hasCommands()){
			this.commands[0].endTurn();
		}
	}

	makeMove(to){
		this.tileInfo.leave(this);
		this.position = to.getTile();
		this.view.moveTo(this.position);

		let from = this.tileInfo;
		this.tileInfo = this.map.getTileInfo(this.position);
		this.tileInfo.enter(this);

		this.movesLeft -= this.tileInfo.movementCost(from);
		if(this.movesLeft < 0)
			this.movesLeft = 0;

		this.stopBeingCargo();

		this.uncoverMap();
	}

	teleport(to){
		if(!this.isCargo)
			console.error('teleport is only allowed when being cargo');

		this.position = to.getTile();
		this.view.teleport(this.position);
	}

	nextTurn(){
		this.movesLeft = this.props.moves;
		this.waiting = false;
	}

	disband(){
		this.view.destroy();
		if(UnitController.instance.selectedUnit === this){
			UnitController.instance.selectedUnit = null;
		}

		UnitController.instance.removeUnit(this);

		UnitController.instance.selectNext();
	}

	canLoad(){
		for(let c of this.cargo){
			if(c === null)
				return true;
		}

		return false;
	}

	uncoverMap(){
		let tile = this.position.getTile();

		//discover all tiles in radius 1
		for(let x = -1; x <= 1; x++){
			for(let y = -1; y <= 1; y++){
				tile.x = this.position.x + x;
				tile.y = this.position.y + y;
				this.map.discover(tile);
			}
		}
	}

}


export default Unit;