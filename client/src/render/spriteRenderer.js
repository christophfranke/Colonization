
// import Phaser from 'phaser';
import Colonize from '../colonize.js';
import Settings from '../../data/settings.json';
import Phaser from 'phaser';
import Position from '../helper/position.js';
import MapTileView from '../view/mapTileView.js';



class SpriteRenderer {
	constructor(){
		Colonize.renderer = this;


		this.display = Colonize.game.add.spriteBatch();

		//fill array with empty arrays
		this.sprites = Array(Colonize.map.mapData.numTiles.total);
		for(let i=0; i<this.sprites.length; i++){
			this.sprites[i] = [];
		}

		this.visible = true;



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

		//cullin margin for cheap culling (needs more!)
		this.margin = {
			x: Math.ceil(0.6*this.cameraWidth.x),
			y: Math.ceil(0.6*this.cameraWidth.y)
		};

		//and for expensive culling
		this.smallMargin = {
			x: 2,
			y: 2
		};

		//somehow the center is off by 1... (looks like a bug!)
		this.offset = {
			x: 1,
			y: 1
		};
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
		let index = this.tileIndex(tile);

		//update common sprites
		let common = Math.min(indices.length, this.sprites[index].length)
		for(let i = 0; i < common; i++){
			this.sprites[index][i].frame = indices[i]-1;
		}

		//create new sprites
		if(indices.length > this.sprites[index].length){

			for(let i = common; i < indices.length; i++){

				let newSprite = Colonize.game.add.sprite(
					tile.x*Settings.tileSize.x,
					tile.y*Settings.tileSize.y,
					'mapSheet',
					indices[i] - 1,
					this.display
				);

				this.sprites[index].push(newSprite);
				this.spriteCount++;
			}
		}

		//remove old sprites
		if(indices.length < this.sprites[index].length){
			for(let i = common; i < this.sprites[index].length; i++){
				this.sprites[index][i].destroy();
				this.spriteCount--;
			}
			this.sprites[index].length = common;
		}
	}

	tileIndex(tile){
		return tile.x + tile.y*Colonize.map.mapData.numTiles.x;
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

		let cameraPosition = this.lastCameraPosition.getTile();

		for(let x = cameraPosition.x - this.smallMargin.x; x < cameraPosition.x + this.cameraWidth.x + this.smallMargin.x; x++){
			for(let y = cameraPosition.y - this.smallMargin.y; y < cameraPosition.y + this.cameraWidth.y + this.smallMargin.y; y++){

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
					let from = this.tileIndex(position);
					let added = false;
					for(let sprite of this.sprites[from]){
						this.display.addChild(sprite);
						this.spriteCount++;
						added = true;
					}
					if(added)
						this.tileCount++;
				}
			}
		}		
	}

	render(){
		//don't do anything if camera doesn't move;
		if(this.lastCameraPosition.x == Colonize.game.camera.x && this.lastCameraPosition.y == Colonize.game.camera.y)
			return;

		this.lastCameraPosition = new Position({
			x: Colonize.game.camera.x,
			y: Colonize.game.camera.y,
			type: Position.WORLD
		});

		this.updateScreen();
	}


}


export default SpriteRenderer;