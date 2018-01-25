
import Phaser from 'phaser';
import Colonize from '../colonize.js';
import Resources from '../../data/resources.json';

class ContextMenu {
	constructor(props){
		this.choices = props.choices;
		this.parentScreen = props.parentScreen;
		this.callback = props.callback;

		this.layer = new Phaser.Group(Colonize.game, this.parentScreen);

		let angleDistance = 2*Math.PI / this.choices.length;
		let currentAngle = -Math.PI;
		let radius = 75;
		for(let choice of this.choices){
			let index = 0;
			let scale = 1;
			if(choice.type === 'resource'){
				index = Resources[choice.resource].id;
				scale = this.scaleCorrection(choice.amount);
			}

			choice.sprite = Colonize.game.add.sprite(
				Math.round(radius*Math.sin(currentAngle)),
				Math.round(radius*Math.cos(currentAngle)),
				'mapSheet',
				index - 1,
				this.layer
			);
			choice.sprite.inputEnabled = true;
			choice.sprite.anchor = new Phaser.Point(0.5, 0.5);
			choice.sprite.scale = new Phaser.Point(scale, scale);
			choice.sprite.events.onInputDown.add(() => this.select(choice), this);
			currentAngle += angleDistance;
		}

		Colonize.game.input.onDown.addOnce(this.globalPointerDown, this);
	}

	globalPointerDown(){
		setTimeout(() => {
			this.destroy();
		}, 0);
	}

	select(choice){
		this.destroy();

		//tell about choice made
		this.callback(choice);
	}

	destroy(){
		for(let sprite of this.layer.children){
			sprite.destroy();
		}
		this.layer.destroy();		
	}

	scaleCorrection(scale){
		return 0.75*Math.sqrt(scale);
	}
}

export default ContextMenu;