import Resources from 'data/resources.json';


class ProductionView {
	constructor(props){
		this.parentScreen = props.parentScreen;
		this.x = props.x || 0;
		this.y = props.y || 0;
		this.width = props.width || 100;

		this.layer = game.add.group();
		this.parentScreen.addChild(this.layer);

		if(props.amount > 0)
			this.setProduction(props.amount, props.resource);
	}

	setProduction(amount, resource){
		for(let sprite of this.layer.children)
			sprite.destroy();
		this.layer.removeChildren();

		if(amount > 0){
			this.resource = resource;
			this.amount = amount;

			let index = Resources[this.resource].id;
			for(let i=0; i < this.amount; i++){
				game.add.sprite(
					Math.round(i*this.width / amount) - 50 + this.x,
					20 + this.y,
					'mapSheet',
					index - 1,
					this.layer
				);
			}
		}
	}

}


export default ProductionView;