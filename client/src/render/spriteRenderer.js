import Phaser from 'phaser';

import Settings from 'src/utils/settings.js';
import Position from 'src/utils/position.js';

import TileCache from './tileCache.js';




class SpriteRenderer {
	constructor(props){
		SpriteRenderer.instance = this;
		this.numTiles = props.numTiles;

		this.stencilCaching = true;


		this.display = game.add.group();
		this.tileCache = new TileCache();

		this.background = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'undiscovered');
		this.display.addChild(this.background);

		//fill array with empty spriteBatches
		this.sprites = Array(this.numTiles.total);
		for(let i=0; i<this.sprites.length; i++){
			let position = this.tilePosition(i);
			this.sprites[i] = new Phaser.SpriteBatch(game, this.display);
			this.sprites[i].x = position.x*Settings.tileSize.x;
			this.sprites[i].y = position.y*Settings.tileSize.y;
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

	initTile(tile){
		let view = tile.view;
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

	showSprite(position){
		let where = this.positionIndex(position);
		if(this.sprites[where].children.length > 0){		
			if(this.sprites[where].parent !== this.display){
				this.display.addChild(this.sprites[where]);
				this.tileCount++;
				this.spriteCount += this.sprites[where].children.length;
			}
		}
	}

	tileIndex(tile){
		return this.positionIndex(tile.position);
	}

	positionIndex(pos){
		let position = pos.getTile();
		return position.x + position.y*this.numTiles.x;
	}

	tilePosition(index){
		return new Position({
			x: index % this.numTiles.x,
			y: Math.floor(index / this.numTiles.x),
			type: Position.TILE
		});
	}

	updateTile(tile){
		if(
			tile.x < 0 ||
			tile.x >= this.numTiles.x ||
			tile.y < 0 ||
			tile.y >= this.numTiles.y
		){
			return;
		}

		let view = tile.view;
		this.clearSprite(tile);
		for(let indices of view.layers){
			this.updateSprites(tile, indices);
		}
		this.showSprite(tile.position);
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

		let needBackground = false;
		for(let x = cameraPosition.x - this.margin.left; x < cameraPosition.x + this.cameraWidth.x + this.margin.right; x++){
			for(let y = cameraPosition.y - this.margin.up; y < cameraPosition.y + this.cameraWidth.y + this.margin.down; y++){

				let position = new Position({
					x : x,
					y : y,
					type: Position.TILE
				});

				if(
					position.x >= 0 &&
					position.x < this.numTiles.x &&
					position.y >= 0 &&
					position.y < this.numTiles.y
				){
					let at = this.positionIndex(position);
					if(this.sprites[at].children.length > 0){
						this.display.addChild(this.sprites[at]);
						this.tileCount++;
						this.spriteCount += this.sprites[at].children.length;
						this.showSprite(position);
					}
					else{
						needBackground = true;
					}
				}
			}

			if(needBackground)
				this.display.addChildAt(this.background, 0);
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