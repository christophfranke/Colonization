
// import Phaser from 'phaser';
import Colonize from '../colonize.js';
import Settings from '../../data/settings.json';
import Phaser from 'phaser';
import Position from '../helper/position.js';



class SpriteRenderer {
	constructor(){
		//use 7 layers for now
		this.layers = [
			Colonize.game.add.spriteBatch(),
			Colonize.game.add.spriteBatch(),
			Colonize.game.add.spriteBatch(),
			Colonize.game.add.spriteBatch(),
			Colonize.game.add.spriteBatch(),
			Colonize.game.add.spriteBatch(),
			Colonize.game.add.spriteBatch(),
		];

		this.singleLayer = Colonize.game.add.spriteBatch();

		//fill array with empty arrays
		this.sprites = Array(this.layers.length*Colonize.map.mapData.numTiles.total);
		for(let i=0; i<this.sprites.length; i++){
			this.sprites[i] = [];
		}



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
			x: 5,
			y: 5
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


	updateSprites(tile, layer, indices){
		let index = this.spriteIndex(tile, layer);

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
					this.layers[layer]
				);

				this.sprites[index].push(newSprite);
			}
		}

		//remove old sprites
		if(indices.length < this.sprites[index].length){
			for(let i = common; i < this.sprites[index].length; i++){
				this.sprites[index][i].destroy();
			}
			this.sprites[index].length = common;
		}
	}

	spriteIndex(tile, layer){
		return this.layers.length*this.tileIndex(tile) + layer;
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

		for(let layer = 0; layer < view.layers.length; layer++){
			this.updateSprites(tile, layer, view.layers[layer]);
		}
	}

	render(){
		//don't do anything if camera doesn't move;
		if(this.lastCameraPosition.x == Colonize.game.camera.x && this.lastCameraPosition.y == Colonize.game.camera.y)
			return;

		this.layers.forEach((layer) => {
			layer.removeChildren();
		})

		this.lastCameraPosition = new Position({
			x: Colonize.game.camera.x,
			y: Colonize.game.camera.y,
			type: Position.WORLD
		});
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
					let from = this.spriteIndex(position, 0);
					for(let layer = 0; layer < this.layers.length; layer++){
						for(let sprite of this.sprites[from + layer]){
							this.layers[layer].addChild(sprite);
						}
					}
				}
			}
		}		
	}


}


export default SpriteRenderer;