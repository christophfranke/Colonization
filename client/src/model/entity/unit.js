import UnitProps from 'data/units.json';

import Position from 'src/utils/position.js';
import UnitView from 'src/view/map/unitView.js';
import Map from 'src/model/entity/map.js';
import UnitController from 'src/controller/unit.js';


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
			unit: this
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

		this.tile = this.map.getTileInfo(this.position);
		this.tile.enter(this);
		this.uncoverMap();

		this.commands = [];

		UnitController.instance.addUnit(this);
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


	issueCommand(command){
		command.unit = this;
		this.commands.push(command);
		return this.executeCommand();
	}

	cancelCommand(){
		this.clearCommands();
	}

	clearCommands(){
		for(let command of this.commands){
			if(command.cancel)
				command.cancel();
		}
		this.commands = [];
	}

	finalizeCommand(){
		this.completedCommand = true;
		this.commands = this.commands.slice(1); //remove first command
	}

	executeCommand(){
		if(this.hasCommands()){
			this.completedCommand = false;
			return this.commands[0].execute();
		}
		return Promise.resolve();
	}

	hasCommands(){
		return this.commands.length > 0;
	}

	endTurnCommand(){
		if(this.hasCommands()){
			if(this.commands[0].endTurn)
				return this.commands[0].endTurn();
		}
		return Promise.resolve();
	}

	makeMove(to){
		this.tile.leave(this);
		let from = this.tile;

		this.position = to.getTile();
		this.tile = this.map.getTileInfo(this.position);
		this.tile.enter(this);

		let cost = this.tile.movementCost(from);
		let promise = this.view.moveTo(this.position, cost);

		for(let cargo of this.cargo){
			if(cargo && cargo.makeMove){
				promise = promise.then(() => {
					return cargo.makeMove(to);
				});
			}
		}

		if(!this.isCargo){		
			this.movesLeft -= cost;
			if(this.movesLeft < 0)
				this.movesLeft = 0;
		}

		this.uncoverMap();
		return promise;
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