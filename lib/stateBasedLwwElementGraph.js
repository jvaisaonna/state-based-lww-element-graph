import log from "fancy-log";
import Graph from "./graph.js";
import LwwTwoPhaseSet from "./lwwTwoPhaseSet.js";

const errorMessage = {
  VERTEX_EXIST: "%s vertex already exist in the graph",
  VERTEX_DOES_NOT_EXIST: "%s vertex does not exist in the graph",
};

export default class StateBasedLwwElementGraph {
  constructor() {
    this.verticesSet = new LwwTwoPhaseSet();
    this.edgesSet = new LwwTwoPhaseSet();
    this._graph = new Graph();
  }

  addVertex(vertex, timestamp = Date.now()) {
    this.verticesSet.add(vertex, timestamp);
  }

  removeVertex(vertex, timestamp = Date.now()) {
    if (!this.verticesSet.lookup(vertex)) {
      log(errorMessage.VERTEX_DOES_NOT_EXIST, vertex);
      return;
    }
    this.verticesSet.remove(vertex, timestamp);
  }

  makeEdge(from, to) {
    return (
      [from, to].sort((a, b) => {
        const nameA = a.toUpperCase(); // ignore upper and lowercase
        const nameB = b.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        // vertex names equal
        return 0;
      }) + ""
    );
  }

  addEdge(from, to, timestamp = Date.now()) {
    const edge = this.makeEdge(from, to);
    this.addEdge(edge, timestamp);
  }

  removeEdge(from, to, timestamp = Date.now()) {
    const edge = this.makeEdge(from, to);
    this.removeEdge(edge, timestamp);
  }

  mergeGraph(incomingStateBasedLwwElementGraph) {
    this.verticesSet.merge(incomingStateBasedLwwElementGraph.verticesSet);
    this.edgesSet.merge(incomingStateBasedLwwElementGraph.edgesSet);
  }

  get graph() {
    return this._graph;
  }
}
