
import Colonize from '../colonize.js';
import Phaser from 'phaser';

class StorageView{
	constructor(props){
		this.style = {
		};

		this.textSprites = {};

		this.colony = props.colony;
		this.parentScreen = props.parentScreen;

		this.layer = new Phaser.Group(Colonize.game);
		this.parentScreen.addChild(this.layer);

		this.createStorageView();
	}

	createStorageView(){
		let i =0;
		for(let ressource in this.colony.storage){
			this.textSprites[ressource] = Colonize.game.add.text(-962 + 127*i, 537, this.colony.storage[ressource], this.style, this.layer);
			i++;
		}
	}

	update(){
		for(let ressource in this.textSprites){
			this.textSprites[ressource].setText(this.colony.storage[ressource]);
		}
	}

}

export default StorageView;