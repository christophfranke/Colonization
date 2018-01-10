import UnitProps from '../data/units.json';
import Settings from '../data/settings.json';

import Easing from './easing.js';
import Position from './position.js';


class Unit{

	constructor(props){
		this.colonize = props.colonize;

		this.game = this.colonize.game;
		this.map = this.colonize.map;

		this.name = props.name;
		this._position = new Position({
			x: props.position.x,
			y: props.position.y,
			type: props.position.type
		});

		this.props = UnitProps[this.name];

		this.sprite = this.game.add.sprite(this.position.getWorld().x, this.position.getWorld().y, 'mapTiles');
		this.sprite.crop(this.cropRect());

		this.sprite.inputEnabled = true;
		this.sprite.events.onInputDown.add(this.select, this);
	}

	orderMoveTo(position){
		let tileInfo = this.map.mapData.getTileInfo(position);

		if((this.props.domain === 'sea' && tileInfo.props.allowSea) ||
		   (this.props.domain === 'land' && tileInfo.props.allowLand)) {

			let tile = position.getTile();
			if(Math.abs(tile.x - this.position.getTile().x) <= 1 &&
			   Math.abs(tile.y - this.position.getTile().y) <= 1){

				this.position = tile;
			}
		}

	}

	cropRect(){
		let x = ((this.props.id - Settings.firstgid) % Settings.tiles.x) * Settings.tileSize.x;
		let y = Math.floor(this.props.id / Settings.tiles.x) * Settings.tileSize.y;
		let width = Settings.tileSize.x;
		let height = Settings.tileSize.y;

		return new Phaser.Rectangle(x, y, width, height);
	}

	set position(position){
		this._position = position.getTile();

		this.sprite.x = position.getWorld().x;
		this.sprite.y = position.getWorld().y;
	}

	get position(){
		return this._position;
	}

	select(){
		if(Unit.selectedUnit !== null)
			Unit.selectedUnit.unselect();

		Unit.selectedUnit = this;
		this.selected = true;
	    this.tween = this.game.add.tween(this.sprite).to( { alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 0, -1, true);
	}

	unselect(){
		this.selected = false;
		this.tween.stop();
		this.sprite.alpha = 1;
	}



}

Unit.selectedUnit = null;

export default Unit;