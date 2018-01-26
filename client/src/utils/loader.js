import Settings from '../../data/settings.json';


class Loader{

	constructor(){
		Loader.instance = this;
		this.assets = {
			mapData: {
				url: '/assets/maps/america_large.json',
				type: Loader.JSON
			},
			mapTiles: {
				url: '/assets/tilesets/map.png',
				type: Loader.Image
			},
			colonyTiles: {
				url: '/assets/tilesets/colony.png',
				type: Loader.Image
			},
			colonyData: {
				url: '/assets/screens/colony-01.json',
				type: Loader.JSON
			},
			colonyScreen: {
				url: '/assets/screens/colony.png',
				type: Loader.Image
			},
			undiscovered: {
				url: '/assets/screens/undiscovered.jpg',
				type: Loader.Image
			},
			mapSheet: {
				url: '/assets/tilesets/map.png',
				type: Loader.SpriteSheet,
				tileSize: {
					x: Settings.tileSize.x,
					y: Settings.tileSize.y
				}
			},
			uiSheet: {
				url: '/assets/tilesets/ui.png',
				type: Loader.SpriteSheet,
				tileSize: {
					x: 128,
					y: 128
				}
			}
		};
	}


	preload(){

		for(let name in this.assets){
			let r = this.assets[name];
			if(r.type === Loader.JSON){
				game.load.json(name, r.url);
			}
			if(r.type === Loader.Image){
				game.load.image(name, r.url);
			}
			if(r.type === Loader.SpriteSheet){
				game.load.spritesheet(name, r.url, r.tileSize.x, r.tileSize.y);
			}
		}
	}
}

Loader.JSON = 0;
Loader.Image = 1;
Loader.SpriteSheet = 2;

export default Loader;