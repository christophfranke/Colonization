


class ColonistView {
	constructor(props){
		this.colonist = props.colonist;
		this.parentScreen = props.parentScreen;

		let position = new Position({
			x: -482,
			y: 141,
			type: Position.WORLD
		});
		
		this.sprite = new Phaser.Sprite(
			game,
			position.x,
			position.y,
			'mapSheet',
			colonist.id-1
		);

		this.parentScreen.addChild(this.sprite);
		this.sprites.push(this.sprite);

		this.sprite.inputEnabled = true;
		this.sprite.input.enableDrag(true);
		this.sprite.anchor = new Phaser.Point(0.5, 0.5);
		this.sprite.events.onDragStop.add((sprite) => {this.dragColonist(sprite, colonist);});

		if(!colonist.productionView){			
			colonist.productionView = new ProductionView({
				parentScreen: this.sprite,
				amount: 0
			});
		}		
	}
}

export default ColonistView;