import Graph from 'src/utils/graph.js';
import { FibonacciHeap } from '@tyriar/fibonacci-heap';



class PathFinder{
	constructor(props){
		this.undiscoveredCost = 5;
		this.cannotMoveCost = 500;

		this.map = props.map;
		this.graph = new Graph();


		for(let index=0; index < this.map.numTiles.total; index++){
			let center = this.map.tiles[index];
			let neighbors = [];
			if(!center.isBorderTile){			
				let up = center.up();
				let rightUp = up.right();
				let right = center.right();
				let rightDown = right.down();
				let down = center.down();
				let leftDown = down.left();
				let left = center.left();
				let leftUp = left.up();

				neighbors.push({
					index: up.index,
					tile: up,
					cost: up.movementCost(center)
				});
				neighbors.push({
					index: rightUp.index,
					tile: rightUp,
					cost: rightUp.movementCost(center)
				});
				neighbors.push({
					index: right.index,
					tile: right,
					cost: right.movementCost(center)
				});
				neighbors.push({
					index: rightDown.index,
					tile: rightDown,
					cost: rightDown.movementCost(center)
				});
				neighbors.push({
					index: down.index,
					tile: down,
					cost: down.movementCost(center)
				});
				neighbors.push({
					index: leftDown.index,
					tile: leftDown,
					cost: leftDown.movementCost(center)
				});
				neighbors.push({
					index: left.index,
					tile: left,
					cost: left.movementCost(center)
				});
				neighbors.push({
					index: leftUp.index,
					tile: leftUp,
					cost: leftUp.movementCost(center)
				});
			}

			this.graph.addNode({
				index: center.index,
				tile: center
			}, neighbors);
		}
	}

	findDomainChange(from, unit){
		let target = (node) =>{
			return node.tile.props.domain !== from.props.domain;
		};
		return this.find(from, target, unit);
	}


	findPath(from, to, unit){
		let target = (node) => {
			return node.index === to.index
		};
		return this.find(from, target, unit);
	}


	find(from, isTarget, unit){
		const frontier = new FibonacciHeap((a, b) => {
			//comparison by used cost
			if(a.key !== b.key)
				return a.key - b.key;

			//comparison by actual cost
			if(a.value.cost !== b.value.cost)
				return a.value.cost - b.value.cost;

			if(a.value.prev.value.tile.isNextTo(a.value.tile))
				return -1;

			if(b.value.prev.value.tile.isNextTo(b.value.tile))
				return 1;

			return 0;
		});

		let node = this.graph.node(from.index);
		let explored = {};
		let inFrontier = {};
		node = frontier.insert(0, node);
		node.value.prev = node;
		node.value.cost = 0;
		inFrontier[node.value.index] = true;

		while(!frontier.isEmpty()){

			node = frontier.extractMinimum();
			inFrontier[node.value.index] = false;
			if(isTarget(node.value)){
				let path = [node.value.tile];
				while(node.value.prev !== node){
					node = node.value.prev;
					path.push(node.value.tile);
				}

				return path.reverse();
			}

			explored[node.value.index] = true;
			//TODO: calculate how many moves are actually left instead of assuming full moves left always
			let movesLeft = unit.props.moves;
			for(let neighbor of node.value.neighbors){
				if(!explored[neighbor.index]){
					let neighborNode = this.graph.node(neighbor.index);
					let newCost = node.value.cost + Math.min(neighbor.cost, movesLeft);
					if(neighborNode.tile.props.domain !== node.value.tile.props.domain)
						newCost += this.cannotMoveCost;


					if(!inFrontier[neighbor.index]){
						neighborNode.prev = node;
						neighborNode.cost = newCost;

						inFrontier[neighbor.index] = frontier.insert(neighborNode.cost, neighborNode);
					}
					else{
						if(newCost < neighborNode.cost){
							neighborNode.prev = node;
							neighborNode.cost = newCost;

							frontier.decreaseKey(inFrontier[neighbor.index], newCost);
						}
					}
				}
				else{
				}
			}
		}

		//no path found :(
		return [from];
	}



	findReverse(from, to, unit){
		let domain = unit.props.domain;
		if(to.isNextToOrDiagonal(from)){
			if(to.props.domain === domain)
				return [to];
			else
				return [];
		}
		else{
			let target = to;
			if(from.props.domain !== to.props.domain){
				target = this.findDomainChange(to, unit).pop();
			}
			let path = this.findPath(from, target, unit);
			if(path){
				path.reverse();
				path.pop(); //remove last element (this is the current position)

				return path;
			}

			return [];
		}

	}
}


export default PathFinder;