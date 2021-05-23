import log from "fancy-log";
import Graph from "./graph.js";
import LwwTwoPhaseSet from "./lwwTwoPhaseSet.js";

export default class StateBasedLWWElementGraph {
  constructor() {
    this.verticesSet = new LwwTwoPhaseSet();
    this.edgesSet = new LwwTwoPhaseSet();
    this.graph = new Graph();
  }

  addVertex() {}

  removeVertex() {}

  addEdge() {}

  removeEdge() {}

  mergeGraph() {}
}
