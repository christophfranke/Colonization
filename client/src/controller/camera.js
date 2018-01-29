
import Phaser from 'phaser';


class CameraController{
	constructor(){
		CameraController.instance = this;
		this.mapCenterTweenTime = 250; //in millis

		this.currentTarget = null;
	}

	moveTo(newTarget){
		return new Promise((resolve) => {
			if(this.currentTarget && this.currentTarget.x === newTarget.x && this.currentTarget.y === newTarget.y)
				return;

			this.currentTarget = newTarget.getWorld();

			game.add.tween(game.camera).to({
					x: this.currentTarget.x,
					y: this.currentTarget.y
				},
				this.mapCenterTweenTime,
				Phaser.Easing.Cubic.Out,
				true,
				0,
				0,
				false
			).onComplete.add(resolve);
		});
	}
}

export default CameraController;