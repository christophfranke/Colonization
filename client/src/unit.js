import UnitProps from '../data/units.json';
import Settings from '../data/settings.json';
import Easing from './easing.js';


class Unit{

	constructor(props){
		this.game = props.game;
		this.name = props.name;
		this._position = props.position;

		this.props = UnitProps[this.name];

		this.sprite = this.game.add.sprite(this.offset.x, this.offset.y, 'mapTiles');
		this.sprite.crop(this.cropRect());

		this.sprite.inputEnabled = true;
		this.sprite.events.onInputDown.add(this.select, this);
	}

	orderMoveTo(tile){
		if(Math.abs(tile.x - this.position.x) <= 1 &&
		   Math.abs(tile.y - this.position.y) <= 1){

			console.log('moving to tile', this.position, tile);
			this.position = tile;
		}
		else{
			console.log('cannot move to tile', this.position, tile);
		}

	}

	cropRect(){
		let x = ((this.props.id - Settings.firstgid) % Settings.tiles.x) * Settings.tileSize.x;
		let y = Math.floor(this.props.id / Settings.tiles.y);
		let width = Settings.tileSize.x;
		let height = Settings.tileSize.y;

		return new Phaser.Rectangle(x, y, width, height);
	}

	get offset(){
		return {
			x: this.position.x * Settings.tileSize.x,
			y: this.position.y * Settings.tileSize.y
		};
	}

	set position(point){
		this._position = {
			x: point.x,
			y: point.y
		};

		this.sprite.x = Settings.tileSize.x * point.x;
		this.sprite.y = Settings.tileSize.y * point.y;
	}

	get position(){
		return this._position;
	}

	select(){
		if(Unit.selectedUnit !== null)
			Unit.selectedUnit.unselect();

		Unit.selectedUnit = this;
		this.selected = true;
	    this.tween = this.game.add.tween(this.sprite).to( { alpha: 0 }, 500, Easing.None, true, 0, -1, true);
	}

	unselect(){
		this.selected = false;
		this.tween.stop();
		this.sprite.alpha = 1;
	}



}

Unit.selectedUnit = null;

export default Unit;