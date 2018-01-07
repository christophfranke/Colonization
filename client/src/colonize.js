import 'pixi';
import 'p2';
import Phaser from 'phaser';



class Colonize{

	constructor(props){
	    this.game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
	    	preload: this.preload,
	    	create: this.create
	    });
	}

	preload() {
        this.game.load.image('logo', 'phaser.png');
    }

    create() {
        this.logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        this.logo.anchor.setTo(0.5, 0.5);
    }
}

export default Colonize;