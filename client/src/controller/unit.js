import InputContext from 'src/input/context.js';
import MoveCommand from 'src/model/command/move.js';
import BoardShipAction from 'src/model/action/boardShip.js';

import MapController from './map.js';


class UnitController{
	constructor(){
		UnitController.instance = this;
		this.autoSelectTimeout = 250;
		this.unitFollowMargin = 0.15;

		this.selectedUnit = null;
		this.units = [];

		this.newTurn();
	}

	followUnit(unit){
		let screenPos = unit.position.getScreen();
		let margin = this.unitFollowMargin;
		if (!(
			screenPos.x > margin*game.width && 
			screenPos.x < (1-margin)*game.width &&
			screenPos.y > margin*game.height &&
			screenPos.y < (1-margin)*game.height
		)){
			return MapController.instance.centerAt(unit.position);
		}

		return Promise.resolve();
	}

	click(unit){
		this.select(unit);
	}

	newTurn(){
		this.unitQueue = this.units.slice();
		this.currentUnit = 0;
	}

	selectNext(){
		if(this.selectedUnit)
			this.unselect(this.selectedUnit);
		while(this.unitQueue[this.currentUnit]){
			let unit = this.unitQueue[this.currentUnit];
			if(unit.movesLeft > 0 && !unit.isCargo){
				//automatic movement
				if(unit.hasCommands()){
					return new Promise((resolve) => {						
						this.followUnit(unit)
						.then(()=>{
							return unit.executeCommand().then(()=>{
								if(unit.completedCommand && unit.movesLeft > 0){
									this.select(unit);
									return Promise.resolve();
								}
								else{
									return this.selectNext();	
								}
							});
						}).then(() => {
							resolve();
						});
					});
				}
				else{
					InputContext.instance.switch(InputContext.NONE);
					return this.followUnit(unit).then(() => {
						this.select(unit);
					});
				}
			}
			this.currentUnit++;
		}

		//no unit found
		this.unselect(this.selectedUnit);
		InputContext.instance.switch(InputContext.MAP);

		return Promise.resolve();
	}

	select(unit){
		unit.clearCommands();
		if(unit.movesLeft > 0){	
			if(this.selectedUnit !== unit){			
				if(this.selectedUnit)
					this.unselect(this.selectedUnit);

				if(unit.isCargo){
					unit.view.show();
				}

				this.selectedUnit = unit;
				unit.selected = true;
				unit.view.startBlinking();
			}

			this.followUnit(unit);
			InputContext.instance.switch(InputContext.UNIT);
		}
	}

	unselect(unit){
		if(unit){		
			unit.selected = false;
			unit.view.stopBlinking();
			if(unit.isCargo){
				unit.view.hide();
			}

			if(this.selectedUnit === unit)
				this.selectedUnit = null;
		}
	}

	removeUnit(unit){
		let index = this.units.indexOf(unit);
		this.units.splice(index, 1);
		index = this.unitQueue.indexOf(unit);
		this.unitQueue.splice(index, 1);
		if(index <= this.currentUnit)
			this.currentUnit--;
	}

	addUnit(unit){
		this.units.push(unit);
		this.unitQueue.push(unit);
	}

	orderMove(to){
		let unit = this.selectedUnit;

		if(!unit)
			return Promise.reject();

		let tile = unit.map.getTileInfo(to);
		
		if(tile.mapBorder)
			return Promise.reject();

		if(unit.props.domain === tile.props.domain){
			if(unit.isCargo)
				unit.boarding.unload();

			return unit.issueCommand(new MoveCommand({
				unit: unit,
				to: tile
			})).then(() => {			
				if(unit.movesLeft === 0)
					return this.selectNext();
				else
					return this.followUnit(unit);
			});
		}

		//unboard
		if(unit.props.domain === 'sea' && tile.props.domain === 'land' && unit.tile.isNextToOrDiagonal(tile)){
			for(let cargo of unit.cargo){			
				if(cargo !== null && cargo.movesLeft > 0){
					UnitController.instance.select(cargo);
					InputContext.instance.switch(InputContext.UNLOAD);
				}
			}

			return Promise.resolve();
		}

		//board ship
		if(unit.props.domain === 'land' && tile.props.domain === 'sea' && unit.tile.isNextToOrDiagonal(tile)){
			for(let ship of tile.units){
				if(ship.canLoad()){
					unit.boarding = new BoardShipAction({
						unit: unit,
						ship: ship
					});
					return this.selectNext();
				}
			}
		}
	}


}

export default UnitController;