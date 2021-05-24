import Graph from './graph.js';
import LwwTwoPhaseSet from './lwwTwoPhaseSet.js';

// Ignore the vertex order for undirected graph and transfer pair form to string
function makeEdge(from, to) {
  return `${[from, to].sort((a, b) => {
    const vertexA = a.toLowerCase(); // ignore upper and lowercase
    const vertexB = b.toLowerCase(); // ignore upper and lowercase
    if (vertexA < vertexB) {
      return -1;
    }
    if (vertexA > vertexB) {
      return 1;
    }

    return 0; // vertex names equal
  })}`;
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
    this.isLatestGraph = false;
  }

  addVertex(vertex, timestamp = Date.now()) {
    this.isLatestGraph = false;

    this.verticesSet.add(vertex, timestamp);
  }

  removeVertex(vertex, timestamp = Date.now()) {
    if (!this.verticesSet.lookup(vertex)) {
      throw new Error(`${vertex} vertex does not exist`);
    }

    this.isLatestGraph = false;

    this.verticesSet.remove(vertex, timestamp);
  }

  addEdge(from, to, timestamp = Date.now()) {
    if (!this.verticesSet.lookup(from) || !this.verticesSet.lookup(to)) {
      throw new Error(`${from} or ${to} vertex does not exist`);
    }

    this.isLatestGraph = false;
    const edge = makeEdge(from, to);

    this.edgesSet.add(edge, timestamp);
  }
  x;
  removeEdge(from, to, timestamp = Date.now()) {
    const edge = makeEdge(from, to);

    if (!this.edgesSet.lookup(edge)) {
      throw new Error(`[${from}, ${to}] edge does not exist`);
    }

    this.isLatestGraph = false;

    this.edgesSet.remove(edge, timestamp);
  }

  merge(incomingStateBasedLwwElementGraph) {
    this.isLatestGraph = false;

    this.verticesSet.merge(incomingStateBasedLwwElementGraph.verticesSet);
    this.edgesSet.merge(incomingStateBasedLwwElementGraph.edgesSet);
  }

  get graph() {
    if (this.isLatestGraph) {
      return this._graph;
    }

    this.isLatestGraph = true;

    this._graph = new Graph();

    this.verticesSet.lookupAll().forEach((vertex) => this._graph.addVertex(vertex));
    this.edgesSet.lookupAll().forEach((edge) => this._graph.addEdge(...stringToEdgePair(edge)));

    return this._graph;
  }
}
