import log from 'fancy-log';
import Graph from './graph.js';
import LwwTwoPhaseSet from './lwwTwoPhaseSet.js';

const errorMessage = {
	VERTEX_EXIST: '%s vertex already exist',
	VERTEX_DOES_NOT_EXIST: '%s vertex does not exist',
	EDGE_DOES_NOT_EXIST: '[%s, %s] edge does not exist',
};

// Ignore the vertex order for undirected graph
// transfer pair form to string
function makeEdge(from, to) {
	return (
		[from, to].sort((a, b) => {
			const vertexA = a.toUpperCase(); // ignore upper and lowercase
			const vertexB = b.toUpperCase(); // ignore upper and lowercase
			if (vertexA < vertexB) {
				return -1;
			}
			if (vertexA > vertexB) {
				return 1;
			}

			// vertex names equal
			return 0;
		}) + ''
	);
}

// From edge string form (a,b) to array form (["a", "b"])
function stringToEdgePair(edge) {
	return edge.split(',');
}

export default class StateBasedLwwElementGraph {
	constructor() {
		this.verticesSet = new LwwTwoPhaseSet();
		this.edgesSet = new LwwTwoPhaseSet();
		this._graph;
		this.isUpdatedGraph = false;
	}

	addVertex(vertex, timestamp = Date.now()) {
		this.verticesSet.add(vertex, timestamp);
		this.isUpdatedGraph = false;
	}

	removeVertex(vertex, timestamp = Date.now()) {
		if (!this.verticesSet.lookup(vertex)) {
			log(errorMessage.VERTEX_DOES_NOT_EXIST, vertex);
			return;
		}
		this.verticesSet.remove(vertex, timestamp);
		this.isUpdatedGraph = false;
	}

	addEdge(from, to, timestamp = Date.now()) {
		const edge = makeEdge(from, to);
		this.edgesSet.add(edge, timestamp);
		this.isUpdatedGraph = false;
	}

	removeEdge(from, to, timestamp = Date.now()) {
		const edge = makeEdge(from, to);
		if (!this.edgesSet.lookup(edge)) {
			log(errorMessage.EDGE_DOES_NOT_EXIST, from, to);
			return;
		}
		this.edgesSet.remove(edge, timestamp);
		this.isUpdatedGraph = false;
	}

	merge(incomingStateBasedLwwElementGraph) {
		this.verticesSet.merge(incomingStateBasedLwwElementGraph.verticesSet);
		this.edgesSet.merge(incomingStateBasedLwwElementGraph.edgesSet);
		this.isUpdatedGraph = false;
	}

	get graph() {
		if (this.isUpdatedGraph) {
			return this._graph;
		}

		this._graph = new Graph();
		this.verticesSet.list().forEach((vertex) => this._graph.addVertex(vertex));
		this.edgesSet.list().forEach((edge) => this._graph.addEdge(...stringToEdgePair(edge)));

		return this._graph;
	}
}
