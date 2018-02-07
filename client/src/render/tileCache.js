import Phaser from 'phaser';
import PIXI from 'pixi';

import Settings from 'src/utils/settings.js';

import SpriteRenderer from './spriteRenderer.js';


class TileCache{

	constructor(){
		this.textures = {};
		this.numFrames = 0;
		this.numStencils = 0;

		this.renderer = SpriteRenderer.instance;

		this.renderTextures = [];
		this.margin = 2;
		this.renderTextureSize = {
			x: 4096,
			y: 4096
		};

		this.tiles = {
			x: Math.floor(this.renderTextureSize.x / (Settings.tileSize.x + 2*this.margin)),
			y: Math.floor(this.renderTextureSize.y / (Settings.tileSize.y + 2*this.margin))
		};

		this.rescale = {
			x: (Settings.tileSize.x + 2*this.margin) / Settings.tileSize.x,
			y: (Settings.tileSize.y + 2*this.margin) / Settings.tileSize.y,
		};

		this.textureSize = this.tiles.x*this.tiles.y;
	}

	addRenderTexture(){
		this.renderTextures.push(game.add.renderTexture(this.renderTextureSize.x, this.renderTextureSize.y));
	}

	currentRenderTexture(){
		return this.renderTextures[this.renderTextures.length-1];
	}

	currentFrame(){
		return this.numFrames % this.textureSize;
	}

	addStencil(indices){
		if(indices.length < 1)
			return false;

		if(this.hasStencil(indices)){
			return true;
		}

		let hash = this.hash(indices);
		this.textures[hash] = {
			used: 0
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
		if(this.currentFrame() === 0)
			this.addRenderTexture();
		let group = new Phaser.Group(game);
		this.renderer.createSprites(indices, group);
		let nextFrame = this.getTile(this.currentFrame());

		let m = new Phaser.Matrix();
		m.identity().scale(this.rescale.x, this.rescale.y).translate(nextFrame.x-this.margin, nextFrame.y-this.margin);
		this.currentRenderTexture().render(group, m); //render scaled up tile
		this.currentRenderTexture().renderRawXY(group, nextFrame.x, nextFrame.y); //render inner tile

		for(let sprite of group.children){
			sprite.destroy();
		}
		group.destroy();

		this.getStencil(indices).texture = new PIXI.Texture(this.currentRenderTexture(), this.cropRect(this.currentFrame()));
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
		let sprite = new Phaser.Sprite(game, 0, 0, this.textures[hash].texture);

		return sprite;
	}

	hash(indices){
		let hashString = '';
		for(let i of indices){
			hashString += ',' + i;
		}

		return hashString;
	}

	cropRect(frame){
		let tile = this.getTile(frame);
		return new Phaser.Rectangle(tile.x, tile.y, Settings.tileSize.x, Settings.tileSize.y);
	}

	getTile(frame){
		return {
			x : ((frame) % this.tiles.x) * (Settings.tileSize.x + 2*this.margin) + this.margin,
			y : Math.floor(frame / this.tiles.y) * (Settings.tileSize.y + 2*this.margin) + this.margin
		};
	}

}

export default TileCache;