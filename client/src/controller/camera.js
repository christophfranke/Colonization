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

		this.zoomTween = null;
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
			if(newScale < Times.zoom.min || newScale > Times.zoom.max){
				resolve();
				return;
			}
			let centerPosition = new Position({
				x: 0.5*game.width,
				y: 0.5*game.height,
				type: Position.SCREEN
			}).getWorld();
			this.currentTarget.x = centerPosition.x - 0.5*game.width / newScale;
			this.currentTarget.y = centerPosition.y - 0.5*game.height / newScale;
			this.scale = newScale;
		
			this.zoomTween = game.add.tween(game.camera.scale).to({
					x: this.scale,
					y: this.scale
				},
				Times.zoomTime,
				Phaser.Easing.Cubic.Out,
				true,
				0,
				0,
				false
			);
			this.zoomTween.onComplete.add(resolve);
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
		return this.zoomTo(this.scale / Times.zoom.stepSize);
	}

	zoomOut(){
		return this.zoomTo(this.scale * Times.zoom.stepSize);
	}

	disableZoom(){
		if(this.zoomTween)
			this.zoomTween.stop();

		game.camera.scale.x = 1;
		game.camera.scale.y = 1;
	}

	enableZoom(){
		if(this.zoomTween)
			this.zoomTween.stop();

		game.camera.scale.x = this.scale;
		game.camera.scale.y = this.scale;
	}
}

export default CameraController;