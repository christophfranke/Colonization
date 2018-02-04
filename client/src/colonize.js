import 'pixi';
import 'p2';
import Phaser from 'phaser';

import MapController from './controller/map.js';
import KeyboardInput from './input/keyboard.js';
import PointerInput from './input/pointer.js';
import DebugView from './view/common/debugView.js';
import Loader from './utils/loader.js';
import Turn from './model/action/turn.js';
import SpriteRenderer from 'src/render/spriteRenderer.js';
import InputContext from 'src/input/context.js';
import UnitController from 'src/controller/unit.js';
import ColonyController from 'src/controller/colony.js';
import CameraController from 'src/controller/camera.js';


class Colonize{

	constructor(){
        if(typeof Colonize.instance !== 'undefined'){
            throw new Error('Colonize defined multiple times. Nobody knows what happens next...');
        }

        Colonize.instance = this;

        this.debug = true;

        this.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        this.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        window.game = new Phaser.Game(this.width, this.height, Phaser.CANVAS, '', {
            preload: () => this.preload(),
            create: () => this.create(),
            update: () => this.update(),
            render: () => this.render(),
            preRender: () => this.preRender()
        });
        Phaser.Canvas.setSmoothingEnabled(game, false);

        new MapController();
        new UnitController();
        new ColonyController();
        new DebugView();
        new Loader();
        new Turn();
    }

    preload() {
        Loader.instance.preload();
    }

    create() {
        Loader.instance.create();

        //create and register
        new CameraController();
        new KeyboardInput();
        new PointerInput();
        new InputContext({
            context: InputContext.MAP
        });

        MapController.instance.create();
        UnitController.instance.create();

        DebugView.instance.create();

        UnitController.instance.selectNext();
    }

    update() {
        KeyboardInput.instance.update();
    }

    preRender(){
        SpriteRenderer.instance.preRender();
    }

    render(){
        SpriteRenderer.instance.render();
        DebugView.instance.render();
    }

}

export default Colonize;
