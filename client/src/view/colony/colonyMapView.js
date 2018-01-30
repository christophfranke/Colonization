import Settings from 'data/settings.json';
import Places from 'data/places.json';

import Phaser from 'phaser';

import MapView from 'src/view/map/mapView.js';
import Position from 'src/utils/position.js';
import ProductionView from 'src/view/colony/productionView.js';



class ColonyMapView{
	constructor(props){
		this.colony = props.colony;
		this.parentScreen = props.parentScreen;
		this.layer = new Phaser.Group(game);
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
				let mapPosition = new Position({
					x: colonyPosition.x + x,
					y: colonyPosition.y + y,
					type: Position.TILE
				});
				let tile = this.colony.map.getTileInfo(mapPosition);
				let newTileView = MapView.instance.assembleTile(tile);
				let screenPosition = new Position({
					x: this.scale*(x+1)*Settings.tileSize.x + offset.x,
					y: this.scale*(y+1)*Settings.tileSize.y + offset.y - y, // something strange is happening here, the "-y" term should not have to be there...
					type: Position.WORLD
				});
				this.createMapSprite(newTileView, screenPosition, tile);
				if(x === 0 && y === 0){
					this.createColonySprite(screenPosition);
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
				game,
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
		let colonySprite = new Phaser.Sprite(
			game,
			pos.x,
			pos.y,
			'mapSheet',
			Places.colony.id-1
		);
		colonySprite.scale = new Phaser.Point(this.scale, this.scale);

		this.layer.addChild(colonySprite);
		this.sprites.push(colonySprite);

		this.productionViews = [];
		let i = 0;
		for(let production of this.colony.tile.resourceProduction()){
			this.productionViews.push(new ProductionView({
				parentScreen: this.layer,
				resource: production.resource,
				amount: production.amount,
				x: pos.x + 64,
				y: pos.y + 32 + 32*i
			}));
			i++;
		}	}
}

export default ColonyMapView;