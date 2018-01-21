
import Colonize from '../colonize.js';
import TileSprite from './tileSprite.js';
import ColonyMapView from './colonyMapView.js';


class ColonyView {
	constructor(props){

        this.colonyScreen = Colonize.game.add.image(0.5*Colonize.game.width, 0.5*Colonize.game.height, 'colonyScreen');
    	this.colonyScreen.scale = new Phaser.Point(0.5, 0.5);
    	this.colonyScreen.fixedToCamera = true;
        this.colonyScreen.anchor.setTo(0.5, 0.5);
        this.colonyScreen.visible = false;


        this.position = props.position;
        this.tileSprite = new TileSprite({
            id: props.id,
            position: this.position
        });

        this.tileSprite.sprite.inputEnabled = true;
        this.tileSprite.sprite.events.onInputDown.add(this.show, this);

        this.colonyScreen.inputEnabled = true;
        this.colonyScreen.events.onInputDown.add(this.colonyClick, this);

        this.colonyMapView = new ColonyMapView({
            colony: this,
            parentScreen: this.colonyScreen
        });
	}

    colonyClick(){
        console.log('click');
    }

    show(){
        this.colonyScreen.visible = true;
        ColonyView.open = this;

        this.colonyMapView.show();

        Colonize.map.mapView.hide();
        TileSprite.layer.visible = false;
    }

    hide(){
        this.colonyScreen.visible = false;
        if(ColonyView.open === this)
            ColonyView.open = null;

        this.colonyMapView.hide();

        Colonize.map.mapView.show();
        TileSprite.layer.visible = true;
    }


}

ColonyView.open = null
export default ColonyView;