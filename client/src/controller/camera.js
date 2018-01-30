import Times from 'data/times.json';

import Phaser from 'phaser';


class CameraController{
	constructor(){
		CameraController.instance = this;

		this.currentTarget = null;
	}

	moveTo(newTarget){
		return new Promise((resolve) => {
			newTarget = newTarget.getWorld();
			if(this.currentTarget && this.currentTarget.x === newTarget.x && this.currentTarget.y === newTarget.y)
				return;

			let distance = this.distanceSquared(newTarget, game.camera);
			let screenSize = game.width*game.width + game.height*game.height;
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

	distanceSquared(p, q){
		return (p.x - q.x)*(p.x - q.x) + (p.y - q.y)*(p.y - q.y);
	}
}

export default CameraController;