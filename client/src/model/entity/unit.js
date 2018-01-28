import UnitProps from 'data/units.json';

import Position from 'src/utils/position.js';
import TileSprite from 'src/view/map/unitView.js';
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

		this.tileSprite = new TileSprite({
			id: this.props.id,
			position: this.position
		});

		this.tileSprite.sprite.inputEnabled = true;
		this.tileSprite.sprite.events.onInputDown.add(() => {
			UnitController.click(this);
		}, UnitController.instance);

		this.movesLeft = this.props.moves;
		this.isUnit = true;
		this.isCargo = false;
		this.carryingUnit = null;
		this.waiting = false;
		if(typeof this.props.cargo !== 'undefined' && this.props.cargo > 0)
			this.cargo = new Array(this.props.cargo).fill(null);
		else
			this.cargo = [];

		this.tileInfo = this.map.getTileInfo(this.position);
		this.tileInfo.enter(this);
		this.uncoverMap();

		Unit.all.push(this);
	}

	orderMoveTo(position){
		let target = this.map.getTileInfo(position);
		
		if(target.mapBorder)
			return;

		if(this.movesLeft > 0 && this.props.domain === target.props.domain) {

			let tile = position.getTile();
			if(Math.abs(tile.x - this.position.getTile().x) <= 1 &&
			   Math.abs(tile.y - this.position.getTile().y) <= 1){

				this.makeMove(tile);
				if(this.movesLeft === 0)
					UnitController.instance.selectNext();
				else
					UnitController.instance.followUnit(this);
			}
		}

		if(this.props.domain === 'sea' && target.props.domain === 'land'){
			let cargoUnit = this.getCargoUnit();
			if(cargoUnit !== null && cargoUnit.movesLeft > 0){
				UnitController.instance.select(cargoUnit);
			}
		}

		if(this.movesLeft > 0 && this.props.domain === 'land' && target.props.domain === 'sea'){
			for(let u of target.units){
				if(u.canLoad()){
					this.becomeCargo(u);
					this.movesLeft--;
				}
			}
		}
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
		this.tileSprite.hide();

		unit.addCargo(this);

		UnitController.instance.selectNext();
	}

	stopBeingCargo(){
		if(this.isCargo){
			this.isCargo = false;
			this.carryingUnit.removeCargo(this);
			this.carryingUnit = null;
			this.tileSprite.show();
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

	makeMove(to){
		this.tileInfo.leave(this);
		this.position = to.getTile();
		this.tileSprite.moveTo(this.position);

		this.tileInfo = this.map.getTileInfo(this.position);
		this.tileInfo.enter(this);

		this.movesLeft--;
		this.stopBeingCargo();

		this.uncoverMap();
	}

	teleport(to){
		if(!this.isCargo)
			console.error('teleport is only allowed when being cargo');

		this.position = to.getTile();
		this.tileSprite.teleport(this.position);
	}

	nextTurn(){
		this.movesLeft = this.props.moves;
		this.waiting = false;
	}

	disband(){
		this.tileSprite.destroy();
		if(UnitController.instance.selectedUnit === this){
			UnitController.instance.selectedUnit = null;
		}

		this.index = Unit.all.indexOf(this);
		Unit.all.splice(this.index, 1);

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

Unit.all = [];

export default Unit;