import Phaser from 'phaser';

import TileSprite from 'src/view/map/unitView.js'; //TODO: this is not good! do not use unit view in colony screen
import MapView from 'src/view/map/mapView.js';
import ColonyMapView from './colonyMapView.js';
import ColonistsView from './colonistsView.js';
import StorageView from './storageView.js';

class ColonyView {
	constructor(props){

        this.colonyScreen = game.add.image(0.5*game.width, 0.5*game.height, 'colonyScreen');
    	this.colonyScreen.scale = new Phaser.Point(0.5, 0.5);
    	this.colonyScreen.fixedToCamera = true;
        this.colonyScreen.anchor.setTo(0.5, 0.5);
        this.colonyScreen.visible = false;

        this.colony = props.colony;


        this.position = props.colony.position;
        this.tileSprite = new TileSprite({
            id: props.id,
            position: this.position
        });

        this.tileSprite.sprite.inputEnabled = true;
        this.tileSprite.sprite.events.onInputDown.add(this.show, this);

        this.colonyScreen.inputEnabled = true;
        this.colonyScreen.events.onInputDown.add(this.colonyClick, this);

        this.colonyMapView = new ColonyMapView({
            colony: this.colony,
            parentScreen: this.colonyScreen
        });

        this.colonistsView = new ColonistsView({
            colony: this.colony,
            parentScreen: this.colonyScreen
        });

        this.storageView = new StorageView({
            colony: this.colony,
            parentScreen: this.colonyScreen
        });
	}

    colonyClick(){
    }

    show(){
        this.colonyScreen.visible = true;
        ColonyView.open = this;

        this.colonyMapView.show();

        MapView.instance.hide();
        TileSprite.layer.visible = false;
    }

    hide(){
        this.colonyScreen.visible = false;
        if(ColonyView.open === this)
            ColonyView.open = null;

        this.colonyMapView.hide();

        MapView.instance.show();
        TileSprite.layer.visible = true;
    }


}

ColonyView.open = null;
export default ColonyView;