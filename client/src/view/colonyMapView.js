

import Colonize from '../colonize.js';
import Position from '../helper/position.js';
import Settings from '../../data/settings.json';
import Places from '../../data/places.json';
import Phaser from 'phaser';


class ColonyMapView{
	constructor(props){
		this.colony = props.colony;
		this.parentScreen = props.parentScreen;


		this.mapTiles = [];
		this.sprites = [];

		this.scale = 4;
	}

	show(){
		this.renderTiles();
	}

	hide(){
	}

	renderTiles(){
		for(let sprite of this.sprites){
			sprite.destroy();
		}

		this.mapTiles = [];
		this.sprites = [];
		let offset = new Position({
			x: 256,
			y: -512 - 64,
			type: Position.WORLD
		});

		let colonyPosition = this.colony.position.getTile();
		for(let x = -1; x <= 1; x++){
			for(let y = -1; y <= 1; y++){
				let tile = new Position({
					x: colonyPosition.x + x,
					y: colonyPosition.y + y,
					type: Position.TILE
				});
				let newTileView = Colonize.map.mapView.renderTile(tile);
				let currentPosition = new Position({
					x: this.scale*(x+1)*Settings.tileSize.x + offset.x,
					y: this.scale*(y+1)*Settings.tileSize.y + offset.y,
					type: Position.WORLD
				});
				this.mapTiles.push(newTileView);
				this.createMapSprite(newTileView, currentPosition);
				if(x === 0 && y === 0){
					this.createColonySprite(currentPosition);
				}
			}
		}
	}

	createMapSprite(tileView, position){
		let indices = tileView.getIndices();
		let pos = position.getWorld();
		for(let index of indices){
			let newSprite = new Phaser.Sprite(
				Colonize.game,
				pos.x,
				pos.y,
				'mapSheet',
				index-1
			);
			newSprite.scale = new Phaser.Point(this.scale, this.scale);

			this.parentScreen.addChild(newSprite);
			this.sprites.push(newSprite);
		}
	}

	createColonySprite(position){
		let pos = position.getWorld();
		let newSprite = new Phaser.Sprite(
			Colonize.game,
			pos.x,
			pos.y,
			'mapSheet',
			Places.colony.id-1
		);
		newSprite.scale = new Phaser.Point(this.scale, this.scale);

		this.parentScreen.addChild(newSprite);
		this.sprites.push(newSprite);
	}
}

export default ColonyMapView;