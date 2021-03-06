import Options from 'data/options.json';

import InputContext from 'src/input/context.js';
import MoveCommand from 'src/model/command/move.js';
import BoardShipAction from 'src/model/action/boardShip.js';
import Unit from "src/model/entity/unit.js";
import FoundColonyCommand from "src/model/command/foundColony.js";

import Position from 'src/utils/position.js';

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

	create(){
        for(let unit of Options.units){
            new Unit({
            	name: unit.name,
            	position: new Position({
            		x: unit.position.x,
            		y: unit.position.y,
            		type: Position.TILE
            	})
            });
        }

        for(let colony of Options.colonies){
            new Unit({
            	name: 'settler',
            	position: new Position({
            		x: colony.position.x,
            		y: colony.position.y,
            		type: Position.TILE
            	})
            }).issueCommand(new FoundColonyCommand());
        }	
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
					InputContext.instance.switch(InputContext.NONE);
					return new Promise((resolve) => {
						return unit.executeCommand().then(()=>{
							if(unit.completedCommand && unit.movesLeft > 0){
								this.select(unit);
								InputContext.instance.switchBack();
								resolve();
							}
							else{
								this.currentUnit++;
								return this.selectNext().then(() =>{
									InputContext.instance.switchBack();
									resolve();
								});
							}
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

		
		//movement 
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


}

export default UnitController;