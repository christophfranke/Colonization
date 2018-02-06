import Times from 'data/times.json';

import Phaser from 'phaser';


class CameraController{
	constructor(){
		CameraController.instance = this;

		this.scale = 1;
		this.currentTarget = null;

		this.ZoomTo(0.5);
	}

	moveTo(newTarget){
		return new Promise((resolve) => {
			newTarget = newTarget.getWorld();
			if(this.currentTarget && this.currentTarget.x === newTarget.x && this.currentTarget.y === newTarget.y)
				return;

			let distance = this.distanceSquared(newTarget, game.camera);
			let screenSize = (game.width*game.width + game.height*game.height) / (this.scale);
			let tweenTime;
			for(let factor of Object.keys(Times.mapCenterTweenTime).sort()){
				tweenTime = Times.mapCenterTweenTime[factor];
				if(factor === 'default' || distance/screenSize < factor*factor){
					break;
				}
			}

			this.currentTarget = newTarget.getWorld();


			game.add.tween(game.camera).to({
					x: this.currentTarget.x,
					y: this.currentTarget.y
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

	ZoomTo(newScale){
		this.scale = newScale;
		game.camera.scale.x = this.scale;
		game.camera.scale.y = this.scale;
	}

	distanceSquared(p, q){
		return (p.x - q.x)*(p.x - q.x) + (p.y - q.y)*(p.y - q.y);
	}
}

export default CameraController;