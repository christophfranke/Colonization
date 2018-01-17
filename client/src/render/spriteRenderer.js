
// import Phaser from 'phaser';
import Colonize from '../colonize.js';
import Settings from '../../data/settings.json';
import Phaser from 'phaser';
import Position from '../helper/position.js';


const BASE_LAYER = "0";
const UP_BLEND = "1";
const LEFT_BLEND = "2";
const RIGHT_BLEND = "3";
const DOWN_BLEND = "4";
const COAST_LINE = "5";
const UNDISCOVERED = "6";
const TOP_LAYER = "7";

class SpriteRenderer {
	constructor(){
		this.cheapCulling = true;

		this.baseLayer = Colonize.game.add.spriteBatch();
		this.blendLayer = Colonize.game.add.spriteBatch();
		this.coastLayer = Colonize.game.add.spriteBatch();
		this.undiscoveredLayer = Colonize.game.add.spriteBatch();
		this.topLayer = Colonize.game.add.spriteBatch();

		this.tiles = [];
		this.sprites = [];

		this.cameraWidth = new Position({
			x: Colonize.game.width,
			y: Colonize.game.height,
			type: Position.WORLD
		}).getTile();

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

	pushTile(tile, layers){
		this.tiles.push({
			layer: layers,
			tile: tile,
			visible: true
		});

		this.sprites.push({});
	}

	initialize(){
		for(let t of this.tiles){
			this.updateTile(t.tile, t.layer);
			this.setVisibility(t, false);
		}

		let cameraPosition = new Position({
			x: Colonize.game.camera.x,
			y: Colonize.game.camera.y,
			type: Position.WORLD
		});
		this.updateCulling(cameraPosition, cameraPosition);
	}

	setVisibility(tile, visible){
		let i = this.tileIndex(tile.tile);
		if(tile.visible !== visible){
			tile.visible = visible;

			for(let layer in this.sprites[i]){

				let group = this.getGroup(layer);
				if(visible)
					group.addChild(this.sprites[i][layer]);
				else
					group.removeChild(this.sprites[i][layer]);
			}
		}
	}

	updateSprite(tile, layer, frame){
		let i = this.tileIndex(tile);
		let group = this.getGroup(layer);
		if(this.spriteExists(i, layer)){
			if(frame === 0){
				//exists but frame is 0
				this.sprites[i][layer].destroy();
			}
			else{
				//change frame
				if(this.sprites[i][layer].frame !== frame-1){
					this.sprites[i][layer].frame = frame-1;
				}
			}
		}
		else{
			if(frame !== 0){
				//doesn't exists but frame is not 0
				this.sprites[i][layer] = Colonize.game.add.sprite(tile.x*Settings.tileSize.x, tile.y*Settings.tileSize.y, 'mapSheet', frame-1, group);
				this.sprites[i][layer].autoCull = false; //good but not good enough
			}
			else{
				//doesn't exist, doesn't need to...
			}
		}
	}

	spriteExists(i, layer){
		return (typeof this.sprites[i][layer] !== 'undefined');
	}

	getGroup(layer){
		if(layer === BASE_LAYER)
			return this.baseLayer;
		if(layer === UP_BLEND)
			return this.blendLayer;
		if(layer === LEFT_BLEND)
			return this.blendLayer;
		if(layer === DOWN_BLEND)
			return this.blendLayer;
		if(layer === RIGHT_BLEND)
			return this.blendLayer;
		if(layer === COAST_LINE)
			return this.coastLayer;
		if(layer === UNDISCOVERED)
			return this.undiscoveredLayer;
		if(layer === TOP_LAYER)
			return this.topLayer;
	}

	updateTile(tile, layers){
		if(tile.x >= Colonize.map.mapData.numTiles.x || tile.y >= Colonize.map.mapData.numTiles.y)
			return;

		let i = this.tileIndex(tile);

		this.tiles[i].layer = layers;
		this.tiles[i].visible = true;

		this.updateSprite(tile, BASE_LAYER, layers.baseTile);
		this.updateSprite(tile, UP_BLEND, layers.topBlend);
		this.updateSprite(tile, LEFT_BLEND, layers.leftBlend);
		this.updateSprite(tile, RIGHT_BLEND, layers.rightBlend);
		this.updateSprite(tile, DOWN_BLEND, layers.downBlend);
		this.updateSprite(tile, COAST_LINE, layers.coastTile);
		this.updateSprite(tile, UNDISCOVERED, layers.undiscovered);
		this.updateSprite(tile, TOP_LAYER, layers.topTile);
	}

	tileIndex(tile){
		return tile.x + tile.y*Colonize.map.mapData.numTiles.x;
	}

	render(){
		if(this.cheapCulling)
			return;

		this.baseLayer.removeChildren();
		this.blendLayer.removeChildren();
		this.coastLayer.removeChildren();
		this.undiscoveredLayer.removeChildren();
		this.topLayer.removeChildren();

		let cameraPosition = new Position({
			x: Colonize.game.camera.x,
			y: Colonize.game.camera.y,
			type: Position.WORLD
		}).getTile();

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
					let i = this.tileIndex(position);
					for(let layer in this.sprites[i]){

						let group = this.getGroup(layer);
						group.addChild(this.sprites[i][layer]);
					}
				}
			}
		}		
	}


	updateCulling(from, to){
		if(!this.cheapCulling)
			return;

		let cameraFrom = from.getTile();
		let cameraTo = to.getTile();

		for(let x = cameraFrom.x - this.margin.x; x < cameraFrom.x + this.cameraWidth.x + this.margin.x; x++){
			for(let y = cameraFrom.y - this.margin.y; y < cameraFrom.y + this.cameraWidth.y + this.margin.y; y++){
				
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
					let index = this.tileIndex(position);
					let tile = this.tiles[index];
					this.setVisibility(tile, false);
				}
			}
		}

		for(let x = cameraTo.x - this.margin.x; x < cameraTo.x + this.cameraWidth.x + this.margin.x; x++){
			for(let y = cameraTo.y - this.margin.y; y < cameraTo.y + this.cameraWidth.y + this.margin.y; y++){

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
					let index = this.tileIndex(position);
					let tile = this.tiles[index];
					this.setVisibility(tile, true);
				}				
			}
		}

	}
}


export default SpriteRenderer;