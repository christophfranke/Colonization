
import Colonize from '../colonize.js';


class Ressources{

	constructor(props){
		this.urls = {		
	        mapData: '/assets/maps/test-05.json',
	        mapTiles: '/assets/sprites/map.png'
		}

	}
	preload(){
		Colonize.game.load.json('mapData', this.urls.mapData);
        Colonize.game.load.image('mapTiles', this.urls.mapTiles);	
	}
}


export default Ressources;