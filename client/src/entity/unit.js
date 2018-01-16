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
	}

	orderMoveTo(position){
		let target = Colonize.map.mapData.getTileInfo(position);

		if(this.props.domain === target.props.domain) {

			let tile = position.getTile();
			if(Math.abs(tile.x - this.position.getTile().x) <= 1 &&
			   Math.abs(tile.y - this.position.getTile().y) <= 1){

				this.makeMove(tile);
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

	}

	disband(){
		this.tileSprite.destroy();
		if(Unit.selectedUnit === this){
			Unit.selectedUnit = null;
		}
	}

	select(){
		if(Unit.selectedUnit !== null)
			Unit.selectedUnit.unselect();

		Unit.selectedUnit = this;
		this.selected = true;
		this.tileSprite.startBlinking();
	}

	unselect(){
		this.selected = false;
		this.tileSprite.stopBlinking();
	}



}

Unit.selectedUnit = null;

export default Unit;