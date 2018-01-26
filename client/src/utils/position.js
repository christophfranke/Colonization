import Settings from '../../data/settings.json';


class Position{
	constructor(props){
		this.x = props.x;
		this.y = props.y;
		this.type = props.type;

		let ok = false;
		if(this.type === Position.TILE){
			this.x = Math.floor(this.x);
			this.y = Math.floor(this.y);
			ok = true;
		}
		if(this.type === Position.WORLD)
			ok = true;
		if(this.type === Position.SCREEN)
			ok = true;

		if(!ok)
			console.error('unknown position type', this.type);
	}

	up(){
		let result = this.getTile();
		result.y--;

		return result;
	}

	down(){
		let result = this.getTile();
		result.y++;

		return result;
	}

	left(){
		let result = this.getTile();
		result.x--;

		return result;
	}

	right(){
		let result = this.getTile();
		result.x++;

		return result;
	}

	getTile(){
		if(this.type === Position.TILE){
			return new Position({
				x: this.x,
				y: this.y,
				type: Position.TILE
			});
		}

		if(this.type === Position.WORLD){
			return new Position({
				x: Math.floor(this.x / Settings.tileSize.x),
				y: Math.floor(this.y / Settings.tileSize.y),
				type: Position.TILE
			});
		}
		if(this.type === Position.SCREEN){
			return new Position({
				x: Math.floor((this.x / game.camera.scale.x + game.camera.position.x) / Settings.tileSize.x),
				y: Math.floor((this.y / game.camera.scale.y + game.camera.position.y) / Settings.tileSize.y),
				type: Position.TILE
			});
		}
	}

	getWorld(){
		if(this.type === Position.TILE){
			return new Position({
				x: this.x * Settings.tileSize.x,
				y: this.y * Settings.tileSize.y,
				type: Position.WORLD
			});
		}
		if(this.type === Position.WORLD){
			return new Position({
				x: this.x,
				y: this.y,
				type: Position.WORLD
			});
		}
		if(this.type === Position.SCREEN){
			return new Position({
				x: this.x / game.camera.scale.x + game.camera.position.x,
				y: this.y / game.camera.scale.y + game.camera.position.y,
				type: Position.WORLD
			});
		}

	}

	getScreen(){
		if(this.type === Position.TILE){
			return new Position({
				x: (this.x * Settings.tileSize.x - game.camera.position.x) * game.camera.scale.x,
				y: (this.y * Settings.tileSize.y - game.camera.position.y) * game.camera.scale.y,
				type: Position.SCREEN
			});
		}
		if(this.type === Position.WORLD){
			return new Position({
				x: (this.x - game.camera.position.x) * game.camera.scale.x,
				y: (this.y - game.camera.position.y) * game.camera.scale.y,
				type: Position.SCREEN
			});
		}
		if(this.type === Position.SCREEN){
			return new Position({
				x: this.x,
				y: this.y,
				type: Position.SCREEN
			});
		}

	}
}

Position.TILE = 0;
Position.WORLD = 1;
Position.SCREEN = 2;

export default Position;