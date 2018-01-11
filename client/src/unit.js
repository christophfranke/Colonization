import UnitProps from '../data/units.json';

import Easing from './easing.js';
import Position from './position.js';
import Colonize from './colonize.js';
import TileSprite from './tileSprite.js';
import Colony from './colony.js';


class Unit{

	constructor(props){
		this.name = props.name;
		this._position = new Position({
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
		let tileInfo = Colonize.map.mapData.getTileInfo(position);

		if((this.props.domain === 'sea' && tileInfo.props.allowSea) ||
		   (this.props.domain === 'land' && tileInfo.props.allowLand)) {

			let tile = position.getTile();
			if(Math.abs(tile.x - this.position.getTile().x) <= 1 &&
			   Math.abs(tile.y - this.position.getTile().y) <= 1){

				this.position = tile;
			}
		}
	}

	orderFoundColony(){
		if(this.props.canFound){
			Colony.found(this.position);
			this.disband();
		}
	}

	disband(){
		this.tileSprite.destroy();
		if(Unit.selectedUnit === this){
			Unit.selectedUnit = null;
		}
	}

	set position(position){
		this._position = position.getTile();

		this.tileSprite.moveTo(this._position);
	}

	get position(){
		return this._position;
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