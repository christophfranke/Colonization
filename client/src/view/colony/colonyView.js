import Phaser from 'phaser';

import TileSprite from 'src/view/map/unitView.js'; //TODO: this is not good! do not use unit view in colony screen
import MapView from 'src/view/map/mapView.js';
import ColonyMapView from './colonyMapView.js';
import ColonistView from './colonistView.js';
import StorageView from './storageView.js';
import InputContext from 'src/input/context.js';
import CameraController from 'src/controller/camera.js';

class ColonyView {
	constructor(props){

        this.layer = game.add.group();
        this.background = game.add.tileSprite(0, 0, game.width, game.height, 'undiscovered');
        this.background.inputEnabled = true;
        this.background.fixedToCamera = true;
        this.background.events.onInputDown.add(this.hide, this);
        this.layer.add(this.background);
        this.colonyScreen = game.add.image(0.5*game.width, 0.5*game.height, 'colonyScreen');
    	this.colonyScreen.scale = new Phaser.Point(0.5, 0.5);
    	this.colonyScreen.fixedToCamera = true;
        this.colonyScreen.anchor.setTo(0.5, 0.5);
        this.layer.add(this.colonyScreen);
        
        this.layer.visible = false;

        this.colony = props.colony;


        this.position = props.colony.position;
        this.tileSprite = new TileSprite({
            id: props.id,
            unit: this
        });

        this.tileSprite.sprite.inputEnabled = true;
        this.tileSprite.sprite.events.onInputDown.add(this.show, this);

        this.colonyScreen.inputEnabled = true;
        this.colonyScreen.events.onInputDown.add(this.colonyClick, this);

        this.colonyMapView = new ColonyMapView({
            colony: this.colony,
            parentScreen: this.colonyScreen
        });

        this.colonistViews = [];
        for(let colonist of this.colony.colonists) {
            this.colonistViews.push(new ColonistView({
                colonist,
                parentScreen: this.colonyScreen
            }));
        }

        this.storageView = new StorageView({
            colony: this.colony,
            parentScreen: this.colonyScreen
        });
	}

    colonyClick(){
    }

    updateColonists() {
        
    }

    show(){
        this.updateColonists();

        this.layer.visible = true;
        ColonyView.open = this;
        InputContext.instance.switch(InputContext.COLONY);

        this.colonyMapView.show();
        CameraController.instance.disableZoom();

        MapView.instance.hide();
        TileSprite.layer.visible = false;
    }

    hide(){
        this.layer.visible = false;
        if(ColonyView.open === this)
            ColonyView.open = null;
        InputContext.instance.switchBack();

        this.colonyMapView.hide();
        CameraController.instance.enableZoom();

        MapView.instance.show();
        TileSprite.layer.visible = true;
    }


}

ColonyView.open = null;
export default ColonyView;