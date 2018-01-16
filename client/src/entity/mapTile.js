import Terrain from '../../data/terrain.json';


class MapTile {
	constructor(props){
		this.id = props.id;
		this.position = props.position;

		if(Terrain.forest.id === props.top)
			this.forest = true;

		if(Terrain.hills.id === props.top)
			this.hills = true;

		if(Terrain.mountains.id === props.top){
			this.mountains = true;
		}

		this.discovered = false;

		for(let type in Terrain){
			if(Terrain[type].id === this.id){
				this.props = Terrain[type];
			}
		};
	}

}

export default MapTile;