import Times from 'data/times.json';

import Phaser from 'phaser';

import Settings from 'src/utils/settings.js';


class UnitView{
	constructor(props){
		this.id = props.id;
		this.unit = props.unit;

		this.position = props.unit.position.getWorld();
		this.tweens = {};

		if(typeof UnitView.layer === 'undefined')
			UnitView.layer = game.add.group();

		this.sprite = game.add.sprite(this.position.x, this.position.y, 'mapTiles', 0, UnitView.layer);
		this.sprite.crop(this.cropRect());
	}

	cropRect(){
		let x = ((this.id - 1) % Settings.tiles.x) * Settings.tileSize.x;
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

	moveTo(position, cost){
		if(!cost)
			cost = 1;

		let factor = Math.min(cost / this.unit.props.moves, 1);
		let tweenTime = factor * Times.moveUnit.base;
		if(tweenTime < Times.moveUnit.min)
			tweenTime = Times.moveUnit.min;
		if(tweenTime > Times.moveUnit.max)
			tweenTime = Times.moveUnit.max;
		return new Promise((resolve) => {
			this.position = position.getWorld();

			this.tweens.walk = game.add.tween(this.sprite).to( {
					x: this.position.x,
					y: this.position.y
				},
				tweenTime,
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