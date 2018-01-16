
import Colonize from '../colonize.js';


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
		}
	}
}

Ressources.JSON = 0;
Ressources.Image = 1;

export default Ressources;