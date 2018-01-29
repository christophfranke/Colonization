import Settings from 'data/settings.json';

import Phaser from 'phaser';


class UnitView{
	constructor(props){
		this.id = props.id;
		this.position = props.position.getWorld();
		this.movementTweenTime = 100;
		this.tweens = {};

		if(typeof UnitView.layer === 'undefined')
			UnitView.layer = game.add.group();

		this.sprite = game.add.sprite(this.position.x, this.position.y, 'mapTiles', 0, UnitView.layer);
		this.sprite.crop(this.cropRect());
	}

	cropRect(){
		let x = ((this.id - Settings.firstgid) % Settings.tiles.x) * Settings.tileSize.x;
		let y = Math.floor(this.id / Settings.tiles.x) * Settings.tileSize.y;
		let width = Settings.tileSize.x;
		let height = Settings.tileSize.y;

		return new Phaser.Rectangle(x, y, width, height);
	}

	teleport(position){
		this.position = position.getWorld();
		
		this.sprite.position = new Phaser.Point(
			this.position.x,
			this.position.y
		);
	}

	destroy(){
		this.sprite.destroy();
	}

	hide(){
		this.sprite.visible = false;
	}

	show(){
		this.sprite.visible = true;
	}

	moveTo(position){
		return new Promise((resolve) => {
			this.position = position.getWorld();

			this.tweens.walk = game.add.tween(this.sprite).to( {
					x: this.position.x,
					y: this.position.y
				},
				this.movementTweenTime,
				Phaser.Easing.Linear.None,
				true,
				0,
				0,
				false
			).onComplete.add(resolve);
		});
	}

	startBlinking(){
	    this.tweens.blink = game.add.tween(this.sprite).to( { alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 0, -1, true);		
	}

	stopBlinking(){
		this.tweens.blink.stop();
		this.sprite.alpha = 1;
	}
}


export default UnitView;