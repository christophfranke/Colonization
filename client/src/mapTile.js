import Terrain from '../data/terrain.json';


class MapTile {
	constructor(props){
		this.id = props.id;

		for(let type in Terrain){
			if(Terrain[type].id === this.id){
				this.props = Terrain[type];
			}
		};
	}
}

export default MapTile;