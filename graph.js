import log from "fancy-log";

const errorMessage = {
  VERTEX_EXIST: "%s vertex already exist in the graph",
  VERTEX_DOES_NOT_EXIST: "%s vertex does not exist in the graph",
};

class Graph {
  constructor() {
    this.adjacencyList = new Map(); // Using Map to implement adjacency list of graph
  }

  hasVertex(vertex) {
    return this.adjacencyList.has(vertex);
  }

  addVertex(vertex) {
    if (this.hasVertex(vertex)) {
      log(errorMessage.VERTEX_EXIST, vertex);
    }

    this.adjacencyList.set(vertex, new Set());
  }

  addEdge(from, to) {
    if (!this.hasVertex(from)) {
      log(errorMessage.VERTEX_DOES_NOT_EXIST, from);
      return;
    }
    if (!this.hasVertex(to)) {
      log(errorMessage.VERTEX_DOES_NOT_EXIST, to);
      return;
    }

    this.adjacencyList.get(from).add(to);
    this.adjacencyList.get(to).add(from);
  }

  removeVertex(vertex) {
    if (!this.hasVertex(vertex)) {
      log(errorMessage.VERTEX_DOES_NOT_EXIST, vertex);
    }
    this.adjacencyList.get(vertex).forEach((v) => {
      this.adjacencyList.get(v).delete(vertex);
    });
    this.adjacencyList.delete(vertex);
  }

  removeEdge(from, to) {
    if (!this.hasVertex(from)) {
      log(errorMessage.VERTEX_DOES_NOT_EXIST, from);
      return;
    }
    if (!this.hasVertex(to)) {
      log(errorMessage.VERTEX_DOES_NOT_EXIST, to);
      return;
    }

    this.adjacencyList.get(from).delete(to);
    this.adjacencyList.get(to).delete(from);
  }

  searchVertex(vertex) {
    return this.adjacencyList.get(vertex);
  }

  findPath(from, to) {}
}

export default Graph;
