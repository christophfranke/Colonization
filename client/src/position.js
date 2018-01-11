import Settings from '../data/settings.json';

import Colonize from './colonize.js';


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
				x: Math.floor((this.x / Colonize.game.camera.scale.x + Colonize.game.camera.position.x) / Settings.tileSize.x),
				y: Math.floor((this.y / Colonize.game.camera.scale.y + Colonize.game.camera.position.y) / Settings.tileSize.y),
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
				x: this.x / Colonize.game.camera.scale.x + Colonize.game.camera.position.x,
				y: this.y / Colonize.game.camera.scale.y + Colonize.game.camera.position.y,
				type: Position.WORLD
			});
		}

	}

	getScreen(){
		if(this.type === Position.TILE){
			return new Position({
				x: (this.x * Settings.tileSize.x - Colonize.game.camera.position.x) * Colonize.game.camera.scale.x,
				y: (this.y * Settings.tileSize.y - Colonize.game.camera.position.y) * Colonize.game.camera.scale.y,
				type: Position.SCREEN
			});
		}
		if(this.type === Position.WORLD){
			return new Position({
				x: (this.x - Colonize.game.camera.position.x) * Colonize.game.camera.scale.x,
				y: (this.y - Colonize.game.camera.position.y) * Colonize.game.camera.scale.y,
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