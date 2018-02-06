import Times from 'data/times.json';

import Phaser from 'phaser';


class CameraController{
	constructor(){
		CameraController.instance = this;

		this.scale = 1;
		this.currentTarget = null;

		this.zoomTo(0.5);
	}

	moveTo(newTarget, force){
		return new Promise((resolve) => {
			newTarget = newTarget.getWorld();
			if(!force && (this.currentTarget && this.currentTarget.x === newTarget.x && this.currentTarget.y === newTarget.y)){
				resolve();
				return;
			}

			let distance = this.distanceSquared(newTarget, game.camera);
			let screenSize = (game.width*game.width + game.height*game.height) / this.scale;
			let tweenTime;
			for(let factor of Object.keys(Times.mapCenterTweenTime).sort()){
				tweenTime = Times.mapCenterTweenTime[factor];
				if(factor === 'default' || distance/screenSize < factor*factor){
					break;
				}
			}

			this.currentTarget = newTarget.getWorld();


			game.add.tween(game.camera).to({
					x: this.scale*this.currentTarget.x,
					y: this.scale*this.currentTarget.y
				},
				tweenTime,
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
		});
	}

	distanceSquared(p, q){
		return (p.x - q.x)*(p.x - q.x) + (p.y - q.y)*(p.y - q.y);
	}
}

export default CameraController;