
import Position from '../helper/position.js';
import Colonize from '../colonize.js';
import ContextMenu from '../ui/contextMenu.js';
import Phaser from 'phaser';

class ColonistsView {
	constructor(props){
		this.parentScreen = props.parentScreen;
		this.colony = props.colony;
		this.colonists = this.colony.colonists;

		this.sprites = [];

		let position = new Position({
			x: -1004,
			y: 350,
			type: Position.WORLD
		})
		for(let colonist of this.colonists){
			let newSprite = new Phaser.Sprite(
				Colonize.game,
				position.x,
				position.y,
				'mapSheet',
				colonist.id-1
			);

			this.parentScreen.addChild(newSprite);
			this.sprites.push(newSprite);

			newSprite.inputEnabled = true;
			newSprite.input.enableDrag(true);
			newSprite.anchor = new Phaser.Point(0.5, 0.5);
			newSprite.events.onDragStop.add((sprite) => {this.dragColonist(sprite, colonist)});

			position.x += 32;
		}
	}

	dragColonist(sprite, colonist){
		let from = sprite.input.dragStartPoint;
		let to = sprite.position;
		let tile = this.colony.colonyView.colonyMapView.tileAt(to);
		if(colonist.workOn(tile)){
			let choices = tile.ressourceProduction(colonist);
			for(let choice of choices)
				choice.type = 'resource';

			new ContextMenu({
				choices: choices,
				parentScreen: sprite,
				callback: colonist.selectProduction
			});

			colonist.selectProduction(choices[0]);
		}
		else{
			sprite.position = new Phaser.Point(from.x, from.y);
		}
	}
}

export default ColonistsView;