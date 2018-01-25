

import Colonize from '../colonize.js';
import Position from '../helper/position.js';
import Settings from '../../data/settings.json';
import Places from '../../data/places.json';
import Phaser from 'phaser';


class ColonyMapView{
	constructor(props){
		this.colony = props.colony;
		this.parentScreen = props.parentScreen;
		this.layer = new Phaser.Group(Colonize.game);
		this.parentScreen.addChild(this.layer);


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
				let tileInfo = Colonize.map.getTileInfo(tile);
				let currentPosition = new Position({
					x: this.scale*(x+1)*Settings.tileSize.x + offset.x,
					y: this.scale*(y+1)*Settings.tileSize.y + offset.y - y, // something strange is happening here, the "-y" term should not have to be there...
					type: Position.WORLD
				});
				this.createMapSprite(newTileView, currentPosition, tileInfo);
				if(x === 0 && y === 0){
					this.createColonySprite(currentPosition);
				}
			}
		}
	}

	tileAt(position){
		for(let sprite of this.sprites){
			if(
				position.x >= sprite.x &&
				position.x <= sprite.x+sprite.width &&
				position.y >= sprite.y &&
				position.y <= sprite.y + sprite.width
			){
				return sprite.data.tileInfo;
			}
		}

		return null;
	}

	createMapSprite(tileView, position, tileInfo){
		let indices = tileView.indices;
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
			newSprite.smoothed = false;
			newSprite.data.tileInfo = tileInfo;

			this.layer.addChild(newSprite);
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

		this.layer.addChild(newSprite);
		this.sprites.push(newSprite);
	}
}

export default ColonyMapView;