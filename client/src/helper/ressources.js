
import Colonize from '../colonize.js';
import Settings from '../../data/settings.json';


class Ressources{

	constructor(props){
		this.ressources = {
			mapData: {
				url: '/assets/maps/test-05.json',
				type: Ressources.JSON
			},
			mapTiles: {
				url: '/assets/tilesets/map.png',
				type: Ressources.Image
			},
			colonyTiles: {
				url: '/assets/tilesets/colony.png',
				type: Ressources.Image
			},
			colonyData: {
				url: '/assets/screens/colony-01.json',
				type: Ressources.JSON
			},
			colonyScreen: {
				url: '/assets/screens/colony.png',
				type: Ressources.Image
			},
			undiscovered: {
				url: '/assets/screens/undiscovered.png',
				type: Ressources.Image
			},
			mapSheet: {
				url: '/assets/tilesets/map.png',
				type: Ressources.SpriteSheet
			}
		}
	}


	preload(){

		for(let name in this.ressources){
			let r = this.ressources[name];
			if(r.type === Ressources.JSON){
				Colonize.game.load.json(name, r.url);
			}
			if(r.type === Ressources.Image){
				Colonize.game.load.image(name, r.url);
			}
			if(r.type === Ressources.SpriteSheet){
				Colonize.game.load.spritesheet(name, r.url, Settings.tileSize.x, Settings.tileSize.y);
			}
		}
	}
}

Ressources.JSON = 0;
Ressources.Image = 1;
Ressources.SpriteSheet = 2;

export default Ressources;