
import Unit from '../entity//unit.js';
import Colonize from '../colonize.js';


class KeyboardInput {
	constructor(props){
		this.game = Colonize.game;
		this.map = Colonize.map;

		this.wasDown = {
			leftKey: false,
			rightKey: false,
			upKey: false,
			downKey: false
		};

		this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
		this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		this.game.input.keyboard.onUpCallback = (e) => this.keyUp(e);

		this.updateKeys = false;
	}

	keyUp(e){
		if(e.key === 'c'){
			if(Unit.selectedUnit !== null)
				this.map.centerAt(Unit.selectedUnit.position);
		}
		if(e.key === 'b'){
			if(Unit.selectedUnit !== null)
				Unit.selectedUnit.orderFoundColony();
		}

		if(e.key === 'w'){
			if(Unit.selectedUnit !== null){
				Unit.selectedUnit.waiting = true;
				Unit.selectedUnit.selectNext();
			}
		}

		if(e.keyCode === 27){
			Colonize.fpsCounter.toggleDebugInfo();
		}

		if(e.keyCode === 13){
			let allUnitsMoved = true;
			for(let u of Unit.all){
				allUnitsMoved &= (u.movesLeft === 0 || u.waiting);
			}

			if(allUnitsMoved)
				Colonize.turn.endTurn();
		}
	}

	update(){
		if(!this.updateKeys){
			//wait until all keys are released
			this.updateKeys = (!this.leftKey.isDown) && (!this.rightKey.isDown) && (!this.upKey.isDown) && (!this.downKey.isDown);

			//clear key history
			this.wasDown = {
				left: false,
				right: false,
				up: false,
				down: false
			};
		}

		if(this.updateKeys){

			//just released left key
			if(!this.leftKey.isDown && this.wasDown.leftKey){
				//just released or still pressing upKey
				if(this.upKey.isDown || this.wasDown.upKey){
					this.emitKeypress(-1, -1);
				}
				//just released or still pressing downKey
				else if(this.downKey.isDown || this.wasDown.downKey){
					this.emitKeypress(-1, 1);
				}
				else{
					this.emitKeypress(-1, 0);
				}
			}

			else if(!this.rightKey.isDown && this.wasDown.rightKey){
				if(this.upKey.isDown || this.wasDown.upKey){
					this.emitKeypress(1, -1);
				}
				else if(this.downKey.isDown || this.wasDown.downKey){
					this.emitKeypress(1, 1);
				}
				else{
					this.emitKeypress(1, 0);
				}
			}		

			else if(!this.upKey.isDown && this.wasDown.upKey){
				if(this.leftKey.isDown || this.wasDown.leftKey){
					this.emitKeypress(-1, -1);
				}
				else if(this.rightKey.isDown || this.wasDown.rightKey){
					this.emitKeypress(1, -1);
				}
				else{
					this.emitKeypress(0, -1);
				}
			}

			else if(!this.downKey.isDown && this.wasDown.downKey){
				if(this.leftKey.isDown || this.wasDown.leftKey){
					this.emitKeypress(-1, 1);
				}
				else if(this.rightKey.isDown ||this.wasDown.rightKey){
					this.emitKeypress(1, 1);
				}
				else{
					this.emitKeypress(0, 1);
				}
			}

			if(this.updateKeys){
				this.wasDown.leftKey = this.leftKey.isDown;
				this.wasDown.rightKey = this.rightKey.isDown;
				this.wasDown.upKey = this.upKey.isDown;
				this.wasDown.downKey = this.downKey.isDown;
			}

		}
	}

	emitKeypress(x, y){
		if(Unit.selectedUnit !== null){
			var newPosition = Unit.selectedUnit.position.getTile();
			newPosition.x += x;
			newPosition.y += y;
			Unit.selectedUnit.orderMoveTo(newPosition);
		}

		this.updateKeys = false;
	}
}


export default KeyboardInput;