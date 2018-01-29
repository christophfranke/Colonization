import Graph from 'node-dijkstra';




class PathFinder{
	constructor(props){
		this.undiscoveredCost = 5;
		this.cannotMoveCost = 500;
		this.diagonalPenalty = 0.1;

		this.map = props.map;
		this.graph = {};
		this.graph.land = new Graph();
		this.graph.sea = new Graph();

		for(let domain of ['land', 'sea']){
			console.log(domain);

			for(let index=0; index < this.map.numTiles.total; index++){
				let center = this.map.tiles[index];
				let neighbors = {};
				if(!center.isBorderTile){			
					let up = center.up();
					let rightUp = up.right();
					let right = center.right();
					let rightDown = right.down();
					let down = center.down();
					let leftDown = down.left();
					let left = center.left();
					let leftUp = left.up();


					neighbors[up.indexString()] = this.graphCost(center, up, domain);
					neighbors[rightUp.indexString()] = this.graphCost(center, rightUp, domain) + this.diagonalPenalty;
					neighbors[right.indexString()] = this.graphCost(center, right, domain);
					neighbors[rightDown.indexString()] = this.graphCost(center, rightDown, domain) + this.diagonalPenalty;
					neighbors[down.indexString()] = this.graphCost(center, down, domain);
					neighbors[leftDown.indexString()] = this.graphCost(center, leftDown, domain) + this.diagonalPenalty;
					neighbors[left.indexString()] = this.graphCost(center, left, domain);
					neighbors[leftUp.indexString()] = this.graphCost(center, leftUp, domain) + this.diagonalPenalty;
				}

				this.graph[domain].addNode(center.indexString(), neighbors);
			}
		}
	}

	updateTile(tile){
		console.log('not yet implemented', tile);
	}

	graphCost(from, to, domain){
		// if(!to.discovered)
		// 	return this.undiscoveredCost;

		if(to.props.domain === domain)
			return to.movementCost(from);
		
		return this.cannotMoveCost;
	}

	find(from, to, domain){
		let result = this.graph[domain].path(from.indexString(), to.indexString(), {cost: true});
		return result.path;
	}

	findReverse(from, to, domain){
		if(to.isNextToOrDiagonal(from)){
			if(to.props.domain === domain)
				return [to];
			else
				return [];
		}
		else{
			let path = this.find(to, from, domain); //find revers
			if(path){
				let last = path.pop(); //remove last element (this is the current position
				path = path.map((index) => {
						return this.map.tiles[index];
					});

				path.reverse();
				let i = 0;
				while(i < path.length){
					if(path[i].props.domain !== domain)
						path.length = i;
					i++;
				}
				path.reverse();

				return path;
			}

			return [];
		}

	}
}


export default PathFinder;