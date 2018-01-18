
import Colonize from '../colonize.js';
import TileSprite from './tileSprite.js';


class ColonyView {
	constructor(props){
        let center = {
            x: Colonize.game.camera.x + 0.5*Colonize.game.width,
            y: Colonize.game.camera.y + 0.5*Colonize.game.height
        };
    	this.colonyScreen = Colonize.game.add.image(center.x, center.y, 'colonyScreen');
    	this.colonyScreen.scale = new Phaser.Point(0.5, 0.5 );
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
	}

    show(){
        this.colonyScreen.visible = true;
        ColonyView.open = this;

        Colonize.map.mapView.hide();
        TileSprite.layer.visible = false;
    }

    hide(){
        this.colonyScreen.visible = false;
        if(ColonyView.open === this)
            ColonyView.open = null;

        Colonize.map.mapView.show();
        TileSprite.layer.visible = true;
    }


}

ColonyView.open = null
export default ColonyView;