import Assets from 'data/assets.json';
import Settings from './settings.js';

class Loader{

	constructor(){
		Loader.instance = this;

		Settings.tileSize = {
			x: Assets.mapSheet.tileSize.x,
			y: Assets.mapSheet.tileSize.y,
		};
	}


	preload(){

		for(let name in Assets){
			let asset = Assets[name];
			if(asset.type === Loader.JSON){
				game.load.json(name, asset.url);
			}
			if(asset.type === Loader.Image){
				game.load.image(name, asset.url);
			}
			if(asset.type === Loader.SpriteSheet){
				game.load.spritesheet(name, asset.url, asset.tileSize.x, asset.tileSize.y);
			}
		}
	}

	create(){
		let mapSheet = game.cache.getImage('mapSheet');
		Settings.tiles = {
			x: mapSheet.naturalWidth / Settings.tileSize.x,
			y: mapSheet.naturalHeight / Settings.tileSize.y
		};
	}
}

Loader.JSON = "JSON";
Loader.Image = "Image";
Loader.SpriteSheet = "SpriteSheet";

export default Loader;