

import Colonize from '../colonize.js';
import Phaser from 'phaser';
import PIXI from 'pixi';
import Settings from '../../data/settings.json';

class TileCache{

	constructor(){
		this.textures = {};
		this.numFrames = 0;
		this.numStencils = 0;

		this.renderer = Colonize.renderer;

		this.renderTexture = Colonize.game.add.renderTexture(4096, 4096);
		this.tiles = {
			x: Math.floor(4096 / Settings.tileSize.x),
			y: Math.floor(4096 / Settings.tileSize.y)
		};

		this.cacheSize = this.tiles.x*this.tiles.y;
	}

	addStencil(indices){
		if(indices.length <= 1)
			return false;

		if(this.hasStencil(indices)){
			this.getStencil(indices).added++;
			return true;
		}

		if(this.numStencils >= this.tiles.x*this.tiles.y)
			return false;

		let hash = this.hash(indices);
		this.textures[hash] = {
			used: 0,
			added: 0,
		};
		this.numStencils++;

		return true;
	}

	hasStencil(indices){
		return (typeof this.getStencil(indices) !== 'undefined');
	}

	stencilReady(indices){
		return (typeof this.getStencil(indices).texture !== 'undefined');
	}

	getStencil(indices){
		let hash = this.hash(indices);
		return this.textures[hash];
	}

	renderStencil(indices){
		let group = new Phaser.Group(Colonize.game);
		this.renderer.createSprites(indices, group);
		let nextFrame = this.getTile(this.numFrames);
		this.renderTexture.renderRawXY(group, nextFrame.x, nextFrame.y);

		for(let sprite of group.children){
			sprite.destroy();
		}
		group.destroy();

		this.getStencil(indices).texture = new PIXI.Texture(this.renderTexture, this.cropRect(this.numFrames));
		this.numFrames++;
	}

	createSprite(indices){
		if(!this.hasStencil(indices)){
			if(!this.addStencil(indices)){
				return null;
			}
		}

		if(!this.stencilReady(indices))
			this.renderStencil(indices);

		let hash = this.hash(indices);
		this.textures[hash].used++;
		let sprite = new Phaser.Sprite(Colonize.game, 0, 0, this.textures[hash].texture);

		return sprite;
	}

	hash(indices){
		let hashString = '';
		for(let i of indices){
			hashString += i;
		}

		return hashString;
	}

	cropRect(frame){
		let tile = this.getTile(frame);
		return new Phaser.Rectangle(tile.x, tile.y, Settings.tileSize.x, Settings.tileSize.y);
	}

	getTile(frame){
		return {
			x : ((frame) % this.tiles.x) * Settings.tileSize.x,
			y : Math.floor(frame / this.tiles.y) * Settings.tileSize.y
		};
	}

}

export default TileCache;