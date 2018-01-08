import Settings from '../data/settings.json';


class Position{
	constructor(props){
		this.x = props.x;
		this.y = props.y;
		this.type = props.type;

		let ok = false;
		if(this.type === Position.TILE)
			ok = true;
		if(this.type === Position.WORLD)
			ok = true;
		if(this.type === Position.SCREEN)
			ok = true;

		if(!ok)
			console.error('unknown position type', this.type);
	}

	getTile(){
		if(this.type === Position.TILE){
			return this;
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
				x: Math.floor((this.x / Position.game.camera.scale.x + Position.game.camera.position.x) / Settings.tileSize.x),
				y: Math.floor((this.y / Position.game.camera.scale.y + Position.game.camera.position.y) / Settings.tileSize.y),
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
			return this;
		}
		if(this.type === Position.SCREEN){
			return new Position({
				x: this.x / Position.game.camera.scale.x + Position.game.camera.position.x,
				y: this.y / Position.game.camera.scale.y + Position.game.camera.position.y,
				type: Position.WORLD
			});
		}

	}

	getScreen(){
		if(this.type === Position.TILE){
			return new Position({
				x: (this.x * Settings.tileSize.x - Position.game.camera.position.x) * Position.game.camera.scale.x,
				y: (this.y * Settings.tileSize.y - Position.game.camera.position.y) * Position.game.camera.scale.y,
				type: Position.SCREEN
			});
		}
		if(this.type === Position.WORLD){
			return new Position({
				x: (this.x - Position.game.camera.position.x) * Position.game.camera.scale.x,
				y: (this.y - Position.game.camera.position.y) * Position.game.camera.scale.y,
				type: Position.SCREEN
			});
		}
		if(this.type === Position.SCREEN){
			return this;
		}

	}
}

Position.TILE = 0;
Position.WORLD = 1;
Position.SCREEN = 2;

export default Position;