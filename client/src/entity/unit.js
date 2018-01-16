import UnitProps from '../../data/units.json';

import Easing from '../view/easing.js';
import Position from '../helper/position.js';
import Colonize from '../colonize.js';
import TileSprite from '../view/tileSprite.js';
import Colony from './colony.js';


class Unit{

	constructor(props){
		this.name = props.name;
		this.position = new Position({
			x: props.position.x,
			y: props.position.y,
			type: props.position.type
		});

		this.props = UnitProps[this.name];

		this.tileSprite = new TileSprite({
			id: this.props.id,
			position: this.position
		});

		this.tileSprite.sprite.inputEnabled = true;
		this.tileSprite.sprite.events.onInputDown.add(this.select, this);

		this.movesLeft = this.props.moves;
		this.waiting = false;

		this.uncoverMap();

		Unit.all.push(this);
	}

	orderMoveTo(position){
		let target = Colonize.map.mapData.getTileInfo(position);

		if(this.movesLeft > 0 && this.props.domain === target.props.domain) {

			let tile = position.getTile();
			if(Math.abs(tile.x - this.position.getTile().x) <= 1 &&
			   Math.abs(tile.y - this.position.getTile().y) <= 1){

				this.makeMove(tile);	
				if(this.movesLeft === 0)
					this.selectNext();
				else
					this.followUnit();

			}
		}
	}

	orderFoundColony(){
		if(this.props.canFound){
			Colony.found(this.position);
			this.disband();
		}
	}

	makeMove(to){
		this.position = to.getTile();
		this.tileSprite.moveTo(this.position);

		this.movesLeft--;

		this.uncoverMap();
	}

	nextTurn(){
		this.movesLeft = this.props.moves;
		this.waiting = false;
	}

	disband(){
		this.tileSprite.destroy();
		if(Unit.selectedUnit === this){
			Unit.selectedUnit = null;
		}

		this.index = Unit.all.indexOf(this);
		Unit.all.splice(this.index, 1);
	}

	uncoverMap(){
		let tile = this.position.getTile();

		//discover all tiles in radius 1
		for(let x = -1; x <= 1; x++){
			for(let y = -1; y <= 1; y++){
				tile.x = this.position.x + x;
				tile.y = this.position.y + y;
				Colonize.map.discover(tile);
			}
		}
	}

	followUnit(){
		let screenPos = this.position.getScreen();
		let margin = 0.15;
		if (!(
			screenPos.x > margin*Colonize.instance.width && 
			screenPos.x < (1-margin)*Colonize.instance.width &&
			screenPos.y > margin*Colonize.instance.height &&
			screenPos.y < (1-margin)*Colonize.instance.height
		)){
			Colonize.map.centerAt(this.position);
		}
	}

	selectNext(){
		for(let u of Unit.all){
			if(u.movesLeft > 0 && !u.waiting){
				u.select();
				return;
			}
		}

		this.unselect();
	}

	select(){
		if(Unit.selectedUnit !== null)
			Unit.selectedUnit.unselect();

		Unit.selectedUnit = this;
		this.selected = true;
		this.tileSprite.startBlinking();

		this.followUnit();

		if(this.movesLeft === 0)
			this.unselect();
	}

	unselect(){
		this.selected = false;
		this.tileSprite.stopBlinking();

		if(Unit.selectedUnit === this)
			Unit.selectedUnit = null;
	}



}

Unit.selectedUnit = null;
Unit.all = [];

export default Unit;