import Times from 'data/times.json';

import Phaser from 'phaser';

import Position from 'src/utils/position.js';


class CameraController{
	constructor(){
		CameraController.instance = this;

		this.scale = 1;
		this.currentTarget = new Position({
			x: 0,
			y: 0,
			type: Position.WORLD
		});
	}

	moveTo(newTarget, force){
		return new Promise((resolve) => {
			newTarget = newTarget.getWorld();
			if(!force && (this.currentTarget && this.currentTarget.x === newTarget.x && this.currentTarget.y === newTarget.y)){
				resolve();
				return;
			}

			this.currentTarget = newTarget.getWorld();


			game.add.tween(game.camera).to({
					x: this.scale*this.currentTarget.x,
					y: this.scale*this.currentTarget.y
				},
				Times.mapCenterTime,
				Phaser.Easing.Cubic.Out,
				true,
				0,
				0,
				false
			).onComplete.add(resolve);
		});
	}

	zoomTo(newScale){
		return new Promise((resolve) => {
			let centerPosition = new Position({
				x: 0.5*game.width,
				y: 0.5*game.height,
				type: Position.SCREEN
			}).getWorld();
			this.currentTarget.x = centerPosition.x - 0.5*game.width / newScale;
			this.currentTarget.y = centerPosition.y - 0.5*game.height / newScale;
			this.scale = newScale;
		
			game.add.tween(game.camera.scale).to({
					x: this.scale,
					y: this.scale
				},
				Times.zoomTime,
				Phaser.Easing.Cubic.Out,
				true,
				0,
				0,
				false
			).onComplete.add(resolve);
			game.add.tween(game.camera).to({
					x: this.scale*this.currentTarget.x,
					y: this.scale*this.currentTarget.y
				},
				Times.zoomTime,
				Phaser.Easing.Cubic.Out,
				true,
				0,
				0,
				false
			);
		});
	}

	zoomIn(){
		return this.zoomTo(this.scale / Times.zoomFactor);
	}

	zoomOut(){
		return this.zoomTo(this.scale * Times.zoomFactor);
	}

	distanceSquared(p, q){
		return (p.x - q.x)*(p.x - q.x) + (p.y - q.y)*(p.y - q.y);
	}
}

export default CameraController;