import Settings from '../data/settings.json';

import Phaser from 'phaser';
import Colonize from './colonize.js';


class TileSprite{
	constructor(props){
		this.id = props.id;
		this.position = props.position.getWorld();

		this.sprite = Colonize.game.add.sprite(this.position.x, this.position.y, 'mapTiles');
		this.sprite.crop(this.cropRect());		
	}

	cropRect(){
		let x = ((this.id - Settings.firstgid) % Settings.tiles.x) * Settings.tileSize.x;
		let y = Math.floor(this.id / Settings.tiles.x) * Settings.tileSize.y;
		let width = Settings.tileSize.x;
		let height = Settings.tileSize.y;

		return new Phaser.Rectangle(x, y, width, height);
	}

	destroy(){
		this.sprite.destroy();
	}

	moveTo(position){
		this.position = position.getWorld();
		this.sprite.position = new Phaser.Point(
			this.position.x,
			this.position.y
		);
	}

	startBlinking(){
	    this.tween = Colonize.game.add.tween(this.sprite).to( { alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 0, -1, true);		
	}

	stopBlinking(){
		this.tween.stop();
		this.sprite.alpha = 1;
	}
}


export default TileSprite;