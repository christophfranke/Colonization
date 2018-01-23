
import Position from '../helper/position.js';
import Colonize from '../colonize.js';

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
			newSprite.events.onDragStop.add((sprite) => {this.dragColonist(colonist, sprite.position);});

			position.x += 32;
		}
	}

	dragColonist(colonist, position){
		let tile = this.colony.colonyView.colonyMapView.tileAt(position);
		colonist.workOn(tile);
	}
}

export default ColonistsView;