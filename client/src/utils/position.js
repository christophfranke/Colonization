import Settings from 'src/utils/settings.js';


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

	getTile(){
		if(this.type === Position.TILE){
			return new Position(this);
		}

		if(this.type === Position.WORLD){
			return new Position({
				x: Math.floor(this.x / Settings.tileSize.x),
				y: Math.floor(this.y / Settings.tileSize.y),
				type: Position.TILE
			});
		}
		if(this.type === Position.SCREEN){
			return this.getWorld().getTile();
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
			return new Position(this);
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
			return this.getWorld().getScreen();
		}
		if(this.type === Position.WORLD){
			return new Position({
				x: (this.x  - game.camera.position.x) * game.camera.scale.x,
				y: (this.y  - game.camera.position.y) * game.camera.scale.y,
				type: Position.SCREEN
			});
		}
		if(this.type === Position.SCREEN){
			return new Position(this);
		}

	}
}

Position.TILE = 0;
Position.WORLD = 1;
Position.SCREEN = 2;

export default Position;