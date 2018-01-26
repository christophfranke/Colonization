import Colonize from 'src/colonize.js';

import Resources from 'data/resources.json';


class ProductionView {
	constructor(props){
		this.parentScreen = props.parentScreen;

		this.layer = Colonize.game.add.group();
		this.parentScreen.addChild(this.layer);
		this.width = 100;

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
				Colonize.game.add.sprite(
					Math.round(i*this.width / amount) - 50,
					20,
					'mapSheet',
					index - 1,
					this.layer
				);
			}
		}

	}

}


export default ProductionView;