import Phaser from 'phaser';

import UnitController from 'src/controller/unit.js';
import MapController from 'src/controller/map.js';
import DebugView from 'src/view/common/debugView.js';
import Turn from 'src/model/action/turn.js';
import WaitCommand from 'src/model/command/wait.js';
import SleepCommand from 'src/model/command/sleep.js';

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
			if(UnitController.instance.selectedUnit){
				if(e.key === 'c'){
					MapController.instance.centerAt(UnitController.instance.selectedUnit.position);
				}
				if(e.key === 'b'){
					UnitController.instance.selectedUnit.orderFoundColony();
				}

				if(e.key === 'w'){
					UnitController.instance.unitQueue.push(UnitController.instance.selectedUnit);
					UnitController.instance.currentUnit++;
					UnitController.instance.selectNext();
				}

				if(e.keyCode === 32){
					UnitController.instance.selectedUnit.issueCommand(new WaitCommand());
					UnitController.instance.selectNext();
				}

				if(e.key === 's' || e.key === 'f'){
					UnitController.instance.selectedUnit.issueCommand(new SleepCommand());
					UnitController.instance.selectNext();
				}
			}
		}

		if(InputContext.instance.context === InputContext.UNLOAD){
			if(UnitController.instance.selectedUnit){				
				if(e.key === 'c'){
					MapController.instance.centerAt(UnitController.instance.selectedUnit.position);
				}
				if(e.key === 'w' || e.keyCode === 32 || e.key === 's' || e.key === 'f'){
					UnitController.instance.selectNext();
				}
			}
		}

		if(InputContext.instance.context === InputContext.MAP){			
			if(e.keyCode === 13){
				UnitController.instance.selectNext();
				if(!UnitController.instance.selectedUnit)
					Turn.instance.endTurn();					
			}
		}

		
		if(e.keyCode === 192){
			DebugView.instance.toggleDebugInfo();
		}
	}

	update(){
		if(InputContext.instance.context === InputContext.UNIT || InputContext.instance.context === InputContext.UNLOAD){
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
						this.orderMovementWithKeys(-1, -1);
					}
					//just released or still pressing downKey
					else if(this.downKey.isDown || this.wasDown.downKey){
						this.orderMovementWithKeys(-1, 1);
					}
					else{
						this.orderMovementWithKeys(-1, 0);
					}
				}

				else if(!this.rightKey.isDown && this.wasDown.rightKey){
					if(this.upKey.isDown || this.wasDown.upKey){
						this.orderMovementWithKeys(1, -1);
					}
					else if(this.downKey.isDown || this.wasDown.downKey){
						this.orderMovementWithKeys(1, 1);
					}
					else{
						this.orderMovementWithKeys(1, 0);
					}
				}		

				else if(!this.upKey.isDown && this.wasDown.upKey){
					if(this.leftKey.isDown || this.wasDown.leftKey){
						this.orderMovementWithKeys(-1, -1);
					}
					else if(this.rightKey.isDown || this.wasDown.rightKey){
						this.orderMovementWithKeys(1, -1);
					}
					else{
						this.orderMovementWithKeys(0, -1);
					}
				}

				else if(!this.downKey.isDown && this.wasDown.downKey){
					if(this.leftKey.isDown || this.wasDown.leftKey){
						this.orderMovementWithKeys(-1, 1);
					}
					else if(this.rightKey.isDown ||this.wasDown.rightKey){
						this.orderMovementWithKeys(1, 1);
					}
					else{
						this.orderMovementWithKeys(0, 1);
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

	orderMovementWithKeys(x, y){
		if(UnitController.instance.selectedUnit){
			let newPosition = UnitController.instance.selectedUnit.position.getTile();
			newPosition.x += x;
			newPosition.y += y;
			UnitController.instance.orderMove(newPosition);
		}

		this.updateKeys = false;
	}
}


export default KeyboardInput;