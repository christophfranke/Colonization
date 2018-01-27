import Phaser from 'phaser';

import Unit from 'src/model/entity/unit.js';
import MapController from 'src/controller/map.js';
import DebugView from 'src/view/common/debugView.js';
import Turn from 'src/model/action/turn.js';

import InputContext from './context.js';


class KeyboardInput {
	constructor(){
		KeyboardInput.instance = this;
		this.game = game;

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
		if(InputContext.instance.context === InputContext.UNIT){
			if(e.key === 'c'){
				if(Unit.selectedUnit !== null)
					MapController.instance.centerAt(Unit.selectedUnit.position);
			}
			if(e.key === 'b'){
				if(Unit.selectedUnit !== null)
					Unit.selectedUnit.orderFoundColony();
			}

			if(e.key === 'w'){
				if(Unit.selectedUnit !== null){
					Unit.selectedUnit.selectNext();
				}
			}

			if(e.keyCode === 32){
				if(Unit.selectedUnit !== null){
					Unit.selectedUnit.waiting = true;
					Unit.selectedUnit.selectNext();
				}
			}
		}

		if(InputContext.instance.context === InputContext.MAP){			
			if(e.keyCode === 13){
				let allUnitsMoved = true;
				for(let u of Unit.all){
					allUnitsMoved &= (u.movesLeft === 0 || u.waiting || u.isCargo);
				}

				if(allUnitsMoved)
					Turn.instance.endTurn();
				else
					Unit.all[0].selectNext();
			}
		}

		
		if(e.keyCode === 192){
			DebugView.instance.toggleDebugInfo();
		}
	}

	update(){
		if(InputContext.instance.context === InputContext.UNIT){
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
	}

	emitKeypress(x, y){
		if(Unit.selectedUnit !== null){
			let newPosition = Unit.selectedUnit.position.getTile();
			newPosition.x += x;
			newPosition.y += y;
			Unit.selectedUnit.orderMoveTo(newPosition);
		}

		this.updateKeys = false;
	}
}


export default KeyboardInput;