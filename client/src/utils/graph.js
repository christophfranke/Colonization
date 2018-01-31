


class Graph{
	constructor(){
		this.nodes = {};
	}

	addNode(node, neighbors){
		this.nodes[node.index] = node;
		if(neighbors)
			this.nodes[node.index].neighbors = neighbors;
	}

	node(index){
		return this.nodes[index];
	}
}

export default Graph;
