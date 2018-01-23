
// import Phaser from 'phaser';
import Colonize from '../colonize.js';
import Settings from '../../data/settings.json';
import Phaser from 'phaser';
import Position from '../helper/position.js';
import MapTileView from '../view/mapTileView.js';



class SpriteRenderer {
	constructor(){
		Colonize.renderer = this;

		this.tileCaching = false;


		this.display = Colonize.game.add.group();
		this.display.cacheAsBitmap = true;

		//fill array with empty spriteBatches
		this.sprites = Array(Colonize.map.mapData.numTiles.total);
		for(let i=0; i<this.sprites.length; i++){
			let tile = this.tileAt(i);
			this.sprites[i] = new Phaser.Group(Colonize.game, this.display);
			this.sprites[i].x = tile.x*Settings.tileSize.x;
			this.sprites[i].y = tile.y*Settings.tileSize.y;
			this.sprites[i].interactiveChildren = false;
		}
		this.visible = true;
		this.spritesUpdated = 0;



		this.cameraWidth = new Position({
			x: Colonize.game.width,
			y: Colonize.game.height,
			type: Position.WORLD
		}).getTile();

		this.lastCameraPosition = new Position({
			x: Colonize.game.camera.x,
			y: Colonize.game.camera.y,
			type: Position.WORLD
		});

		this.lastDisplayUpdate = this.lastCameraPosition.getWorld();

		//cullin margin for cheap culling (needs more!)
		this.margin = new Position({
			x: Math.ceil(0.5*this.cameraWidth.x),
			y: Math.ceil(0.5*this.cameraWidth.y),
			type: Position.TILE
		});

		//somehow the center is off by 1... (looks like a bug!)
		this.offset = new Position({
			x: 1,
			y: 1,
			type: Position.TILE
		});
	}

	pushTile(tile, view){
		this.updateTile(tile, view);
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


	updateSprites(tile, indices){
		let where = this.tileIndex(tile);

		for(let sprite of this.sprites[where].children){
			sprite.destroy();
		}
		this.sprites[where].removeChildren();

		for(let index of indices){
			let newSprite = Colonize.game.add.sprite(
				0,
				0,
				'mapSheet',
				index - 1,
				this.sprites[where]
			);

		}

		if(indices.length > 0){
			if(this.sprites[where].parent !== this.display){
				this.display.addChild(this.sprites[where]);
				this.tileCount++;
				this.spriteCount += indices.length;
			}

			if(this.tileCaching){			
				if(!this.sprites[where].cacheAsBitmap)
					this.sprites[where].cacheAsBitmap = true;
				this.sprites[where].updateCache();
			}
			this.spritesUpdated += indices.length;
		}

		this.hasChanged = true;
	}

	tileIndex(tile){
		return tile.x + tile.y*Colonize.map.mapData.numTiles.x;
	}

	tileAt(index){
		return new Position({
			x: index % Colonize.map.mapData.numTiles.x,
			y: Math.floor(index / Colonize.map.mapData.numTiles.x),
			type: Position.TILE
		});
	}

	updateTile(tile, view){
		if(
			tile.x < 0 ||
			tile.x >= Colonize.map.mapData.numTiles.x ||
			tile.y < 0 ||
			tile.y >= Colonize.map.mapData.numTiles.y
		){
			return;
		}

		this.updateSprites(tile, view.indices);

	}

	updateScreen(){
		this.display.removeChildren();
		this.spriteCount = 0;
		this.tileCount = 0;

		if(!this.visible)
			return;

		let cameraPosition = new Position({
			x: Colonize.game.camera.x,
			y: Colonize.game.camera.y,
			type: Position.WORLD
		}).getTile();

		for(let x = cameraPosition.x - this.margin.x; x < cameraPosition.x + this.cameraWidth.x + this.margin.x; x++){
			for(let y = cameraPosition.y - this.margin.y; y < cameraPosition.y + this.cameraWidth.y + this.margin.y; y++){

				let position = new Position({
					x : x + this.offset.x,
					y : y + this.offset.y,
					type: Position.TILE
				});

				if(
					position.x >= 0 &&
					position.x < Colonize.map.mapData.numTiles.x &&
					position.y >= 0 &&
					position.y < Colonize.map.mapData.numTiles.y
				){
					let at = this.tileIndex(position);
					if(this.sprites[at].children.length > 0){
						this.display.addChild(this.sprites[at]);
						this.tileCount++;
						this.spriteCount += this.sprites[at].children.length;
					}
				}
			}
		}

	}

	render(){
		if(!this.cameraInBounds()){
			this.display.cacheAsBitmap = false;
			this.updateScreen();
			this.hasChanged = false;
		}

		//don't do anything if camera doesn't move;
		if(
			this.hasChanged ||
			(this.lastCameraPosition.x === Colonize.game.camera.x &&
		    this.lastCameraPosition.y === Colonize.game.camera.y &&
		    this.lastDisplayUpdate.x !== Colonize.game.camera.x &&
		    this.lastDisplayUpdate.y !== Colonize.game.camera.y)
		){
			this.updateScreen();
			if(this.display.cacheAsBitmap)
				this.display.updateCache();
			else
				this.display.cacheAsBitmap = true;
			this.lastDisplayUpdate = new Position({
				x: Colonize.game.camera.x,
				y: Colonize.game.camera.y,
				type: Position.WORLD
			});		

			this.hasChanged = false;
		}

		this.lastCameraPosition.x = Colonize.game.camera.x;
		this.lastCameraPosition.y = Colonize.game.camera.y;
	}

	cameraInBounds(){
		let margin = this.margin.getWorld();
		return (
			Math.abs(this.lastDisplayUpdate.x - Colonize.game.camera.x) < margin.x &&
			Math.abs(this.lastDisplayUpdate.y - Colonize.game.camera.y) < margin.y)
	}


}


export default SpriteRenderer;