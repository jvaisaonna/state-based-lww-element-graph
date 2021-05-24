import log from 'fancy-log';

const errorMessage = {
  VERTEX_EXIST: '%s vertex already exist in the graph',
  VERTEX_DOES_NOT_EXIST: '%s vertex does not exist in the graph',
};

export default class Graph {
  constructor() {
    this.adjacencyList = new Map(); // Using Map to implement adjacency list of graph
  }

  hasVertex(vertex) {
    return this.adjacencyList.has(vertex);
  }

  checkVertexExistence(needExist, ...vertices) {
    const message = needExist ? errorMessage.VERTEX_EXIST : errorMessage.VERTEX_DOES_NOT_EXIST;
    let hasError = false;

    vertices.forEach((v) => {
      if (this.hasVertex(v) === needExist) {
        hasError = true;
        log(message, v);
      }
    });

    return hasError;
  }

  addVertex(vertex) {
    // Return if vertex already exist
    if (this.checkVertexExistence(true, vertex)) return;

    this.adjacencyList.set(vertex, new Set());
  }

  addEdge(from, to) {
    if (this.checkVertexExistence(false, from, to)) return;

    this.adjacencyList.get(from).add(to);
    this.adjacencyList.get(to).add(from);
  }

  removeVertex(vertex) {
    if (this.checkVertexExistence(false, vertex)) return;

    this.adjacencyList.get(vertex).forEach((v) => {
      this.adjacencyList.get(v).delete(vertex);
    });
    this.adjacencyList.delete(vertex);
  }

  removeEdge(from, to) {
    if (this.checkVertexExistence(false, from, to)) return;

    this.adjacencyList.get(from).delete(to);
    this.adjacencyList.get(to).delete(from);
  }

  searchVertex(vertex) {
    // return an array which are connected to vertex
    return [...this.adjacencyList.get(vertex)];
  }

  findAllReachableVertices() {}

  // Using depth-first search to find all possible paths
  findAllPaths(from, to, visited = [], allPaths = []) {
    // Check from and to vertices whether exist
    if (this.checkVertexExistence(false, from, to)) return allPaths;

    visited.push(from);

    // Push visited path into all paths array
    // and stop further search when reach target vertex
    // when reach target vertex
    if (from === to) {
      allPaths.push([...visited]);
      return;
    }

    // Get child vertices from current vertex
    const destinations = this.adjacencyList.get(from);

    // travel child vertex when it is not in visited array
    for (const dest of destinations) {
      if (visited.indexOf(dest) < 0) {
        this.findAllPaths(dest, to, visited, allPaths);

        // remove last vertex when the child vertex
        // 1. traveled all child vertex
        // 2. the child vertex is the target vertex
        visited.pop();
      }
    }

    // return all paths sorted by the path length
    return allPaths.sort((a, b) => a.length - b.length);
  }
}