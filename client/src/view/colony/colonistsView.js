import Phaser from 'phaser';


import Position from 'src/utils/position.js';
import ContextMenu from 'src/ui/contextMenu.js';
import ProductionView from './productionView';

class ColonistsView {
	constructor(props){
		this.parentScreen = props.parentScreen;
		this.colony = props.colony;
		this.colonists = this.colony.colonists;

		this.sprites = [];

		let position = new Position({
			x: -482,
			y: 141,
			type: Position.WORLD
		});
		for(let colonist of this.colonists){
			let newSprite = new Phaser.Sprite(
				game,
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
			newSprite.events.onDragStop.add((sprite) => {this.dragColonist(sprite, colonist);});

			position.x += 32;

			if(!colonist.productionView){			
				colonist.productionView = new ProductionView({
					parentScreen: newSprite,
					amount: 0
				});
			}
		}
	}

	dragColonist(sprite, colonist){
		let from = sprite.input.dragStartPoint;
		let to = sprite.position;
		let tile = this.colony.colonyView.colonyMapView.tileAt(to);
		let oldTile = colonist.production ? colonist.production.tile : null;
		if(colonist.workOn(tile)){
			if(tile === oldTile || tile.getYield(colonist, colonist.production.resource) === 0){			
				let choices = tile.ressourceProduction(colonist);
				for(let choice of choices)
					choice.type = 'resource';

				new ContextMenu({
					choices: choices,
					parentScreen: sprite,
					callback: (choice) => {colonist.selectProduction(choice);}
				});
			}

			if(tile !== oldTile){
				//take current production
				if(colonist.production.resource){
					let amount = tile.getYield(colonist, colonist.production.resource);
					colonist.selectProduction({
						amount: amount,
						resource: colonist.production.resource
					});
				}
				//fallback to food of none
				else{
					let amount = tile.getYield(colonist, 'food');
					colonist.selectProduction({
						amount: amount,
						resource: 'food'
					});
				}
			}
		}
		else{
			sprite.position = new Phaser.Point(from.x, from.y);
		}
	}
}

export default ColonistsView;