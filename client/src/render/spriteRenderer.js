
// import Phaser from 'phaser';
import Colonize from '../colonize.js';
import Settings from '../../data/settings.json';


const BASE_LAYER = 0;
const UP_BLEND = 1;
const LEFT_BLEND = 2;
const RIGHT_BLEND = 3;
const DOWN_BLEND = 4;
const COAST_LINE = 5;
const UNDISCOVERED = 6;
const TOP_LAYER = 7;

class SpriteRenderer {
	constructor(){

		this.baseLayer = Colonize.game.add.group();
		this.blendLayer = Colonize.game.add.group();
		this.coastLayer = Colonize.game.add.group();
		this.undiscoveredLayer = Colonize.game.add.group();
		this.topLayer = Colonize.game.add.group();

		this.tiles = [];
		this.sprites = [];
	}

	pushTile(tile, layers){
		this.tiles.push({
			layer: layers,
			tile: tile
		});

		this.sprites.push({});
	}

	initialize(){
		for(let t of this.tiles){
			this.updateTile(t.tile, t.layer);
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
				this.sprites[i][layer].frame = frame-1;
			}
		}
		else{
			if(frame !== 0){
				//doesn't exists but frame is not 0
				this.sprites[i][layer] = Colonize.game.add.sprite(tile.x*Settings.tileSize.x, tile.y*Settings.tileSize.y, 'mapSheet', frame-1, group);	 
				this.sprites[i][layer].autoCull = true; //good but not good enough
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
		let i = this.tileIndex(tile);
		this.tiles[i].layer = layers;

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
		return tile.y + tile.x*200;
	}
}


export default SpriteRenderer;