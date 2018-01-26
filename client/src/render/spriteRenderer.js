import Phaser from 'phaser';

import Settings from 'data/settings.json';

import Position from 'src/utils/position.js';
import Map from 'src/model/entity/map.js';

import TileCache from './tileCache.js';




class SpriteRenderer {
	constructor(props){
		SpriteRenderer.instance = this;
		this.map = props.map || Map.instance;

		this.stencilCaching = true;


		this.display = game.add.group();
		this.tileCache = new TileCache();

		//fill array with empty spriteBatches
		this.sprites = Array(this.map.numTiles.total);
		for(let i=0; i<this.sprites.length; i++){
			let tile = this.tileAt(i);
			this.sprites[i] = new Phaser.SpriteBatch(game, this.display);
			this.sprites[i].x = tile.x*Settings.tileSize.x;
			this.sprites[i].y = tile.y*Settings.tileSize.y;
			this.sprites[i].interactiveChildren = false;
		}
		this.visible = true;
		this.spritesUpdated = 0;
		this.display.removeChildren();



		this.cameraWidth = {
			x: Math.ceil(game.width / Settings.tileSize.x),
			y: Math.ceil(game.height / Settings.tileSize.y)
		};

		this.lastCameraPosition = new Position({
			x: game.camera.x,
			y: game.camera.y,
			type: Position.WORLD
		});

		this.lastDisplayUpdate = this.lastCameraPosition.getWorld();

		this.margin = {
			left: 0,
			right: 1,
			up: 0,
			down: 1
		};
	}

	initTile(tile, view){
		this.clearSprite(tile);
		for(let indices of view.layers){
			this.updateSprites(tile, indices);
		}
	}

	initialize(){
	}

	hide(){
		this.visible = false;
		this.updateScreen();
	}

	show(){
		this.visible = true;
		this.updateScreen();
	}

	clearSprite(tile){
		let where = this.tileIndex(tile);
		for(let sprite of this.sprites[where].children){
			sprite.destroy();
		}
		this.sprites[where].removeChildren();		
	}


	updateSprites(tile, indices){
		let where = this.tileIndex(tile);

		let fromCache = false;
		if(this.stencilCaching){
			let sprite = this.tileCache.createSprite(indices);
			if(sprite !== null){
				this.sprites[where].addChild(sprite);
				this.spritesUpdated++;
				fromCache = true;
			}
		}
		if(!fromCache){
			this.createSprites(indices, this.sprites[where]);
			this.spritesUpdated += indices.length;
		}

		this.hasChanged = true;
	}

	createSprites(indices, parent){
		for(let index of indices){
			game.add.sprite(
				0,
				0,
				'mapSheet',
				index - 1,
				parent
			);
		}
	}

	showSprite(tile){
		let where = this.tileIndex(tile);
		if(this.sprites[where].children.length > 0){		
			if(this.sprites[where].parent !== this.display){
				this.display.addChild(this.sprites[where]);
				this.tileCount++;
				this.spriteCount += this.sprites[where].children.length;
			}
		}
	}

	tileIndex(tile){
		return tile.x + tile.y*this.map.numTiles.x;
	}

	tileAt(index){
		return new Position({
			x: index % this.map.numTiles.x,
			y: Math.floor(index / this.map.numTiles.x),
			type: Position.TILE
		});
	}

	updateTile(tile, view){
		if(
			tile.x < 0 ||
			tile.x >= this.map.numTiles.x ||
			tile.y < 0 ||
			tile.y >= this.map.numTiles.y
		){
			return;
		}

		this.clearSprite(tile);
		for(let indices of view.layers){
			this.updateSprites(tile, indices);
		}
		this.showSprite(tile);
	}

	updateScreen(){
		this.display.removeChildren();
		this.spriteCount = 0;
		this.tileCount = 0;

		if(!this.visible)
			return;

		let cameraPosition = new Position({
			x: game.camera.x,
			y: game.camera.y,
			type: Position.WORLD
		}).getTile();

		for(let x = cameraPosition.x - this.margin.left; x < cameraPosition.x + this.cameraWidth.x + this.margin.right; x++){
			for(let y = cameraPosition.y - this.margin.up; y < cameraPosition.y + this.cameraWidth.y + this.margin.down; y++){

				let position = new Position({
					x : x,
					y : y,
					type: Position.TILE
				});

				if(
					position.x >= 0 &&
					position.x < this.map.numTiles.x &&
					position.y >= 0 &&
					position.y < this.map.numTiles.y
				){
					let at = this.tileIndex(position);
					if(this.sprites[at].children.length > 0){
						this.display.addChild(this.sprites[at]);
						this.tileCount++;
						this.spriteCount += this.sprites[at].children.length;
						this.showSprite(position);
					}
				}
			}
		}

		this.lastDisplayUpdate.x = game.camera.x;
		this.lastDisplayUpdate.y = game.camera.y;
	}

	render(){
		this.lastCameraPosition.x = game.camera.x;
		this.lastCameraPosition.y = game.camera.y;
	}

	preRender(){
		//camera is out of bounds, disable caching and render quickly!
		if(!this.cameraInBounds()){
			this.display.cacheAsBitmap = false;
			this.updateScreen();
			this.hasChanged = false;
		}
	}

	cameraInBounds(){
		return (
			Math.abs(this.lastDisplayUpdate.x - game.camera.x) < 0.1 &&
			Math.abs(this.lastDisplayUpdate.y - game.camera.y) < 0.1
		);
	}


}


export default SpriteRenderer;