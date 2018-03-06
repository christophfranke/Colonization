import Phaser from 'phaser';


import Position from 'src/utils/position.js';
import ContextMenu from 'src/ui/contextMenu.js';
import InputContext from 'src/input/context.js';

import ProductionView from './productionView';


class ColonistView {
	constructor(props){
		this.colonist = props.colonist;
		this.parentScreen = props.parentScreen;

		let position = new Position({
			x: -482,
			y: 141,
			type: Position.WORLD
		});
		
		this.sprite = new Phaser.Sprite(
			game,
			position.x,
			position.y,
			'mapSheet',
			this.colonist.id-1
		);

		this.parentScreen.addChild(this.sprite);

		this.sprite.inputEnabled = true;
		this.sprite.input.enableDrag(true);
		this.sprite.anchor = new Phaser.Point(0.5, 0.5);
		this.sprite.events.onDragStop.add(() => {this.dragColonist();});

		if(!this.colonist.productionView){			
			this.colonist.productionView =	new ProductionView({
				parentScreen: this.sprite,
				amount: 0
			});
		}
	}

	dragColonist(){
		let from = this.sprite.input.dragStartPoint;
		let to = this.sprite.position;
		let tile = this.colonist.colony.colonyView.colonyMapView.tileAt(to);
		let oldTile = this.colonist.production ? this.colonist.production.tile : null;
		if(this.colonist.workOn(tile)){
			if((tile === oldTile) ||
				(this.colonist.production.resource && tile.yield(this.colonist.production.resource, this.colonist) === 0)
			){
				let choices = tile.resourceProduction(this.colonist);
				for(let choice of choices)
					choice.type = 'resource';

				new ContextMenu({
					choices: choices,
					parentScreen: this.sprite,
					callback: (choice) => {this.colonist.selectProduction(choice);}
				});
			}

			if(tile !== oldTile){
				//take current production
				if(this.colonist.production.resource){
					let amount = tile.yield(this.colonist.production.resource, this.colonist);
					this.colonist.selectProduction({
						amount: amount,
						resource: this.colonist.production.resource
					});
				}
				//fallback to food of none
				else{
					let amount = tile.yield('food', this.colonist);
					this.colonist.selectProduction({
						amount: amount,
						resource: 'food'
					});
				}
			}
		}
		else{
			this.sprite.position = new Phaser.Point(from.x, from.y);
		}
	}	
}

export default ColonistView;