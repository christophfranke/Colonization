import 'pixi';
import 'p2';
import Phaser from 'phaser';



class Colonize{

	constructor(props){
		this.width = 640;
		this.height = 480;
	    this.game = new Phaser.Game(this.width, this.height, Phaser.AUTO, '', {
	    	preload: () => this.preload(),
	    	create: () => this.create(),
	    	update: () => this.update()
	    });
	}

	preload() {
		this.game.load.tilemap('test-03', '/assets/maps/test-03.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('mapTiles', '/assets/sprites/map.png');
    }

    create() {
    	this.map = this.game.add.tilemap('test-03');
		this.map.addTilesetImage('sprites', 'mapTiles');
    	
    	this.baseLayer = this.map.createLayer('terrain base');
    	this.topLayer = this.map.createLayer('terrain top');
    	this.baseLayer.resizeWorld();

    	this.baseLayer.inputEnabled = true;
    	this.topLayer.inputEnabled = true;

    	this.topLayer.events.onInputDown.add(this.mapClick, this);

    	this.game.input.mouse.capture = true;

    	console.log(this.game);
    }

    mapClick(e){
    	this.game.camera.position = new Phaser.Point(
    		this.game.camera.position.x + e.input.downPoint.x - 0.5*this.width,
    		this.game.camera.position.y + e.input.downPoint.y - 0.5*this.height
		);
    }

    update() {
    	const delta = this.game.time.physicsElapsed;
    }
}

export default Colonize;
