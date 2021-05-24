export default class Graph {
  constructor() {
    this.adjacencyList = new Map(); // Using Map to implement adjacency list of graph
  }

  hasVertex(vertex) {
    return this.adjacencyList.has(vertex);
  }

  addVertex(vertex) {
    // Return if vertex already exist
    if (this.hasVertex(vertex)) return;

    this.adjacencyList.set(vertex, new Set());
  }

  removeVertex(vertex) {
    if (!this.hasVertex(vertex)) {
      throw new Error(`${vertex} vertex does not exist`);
    }

    // Remove all dependencies in other vertex
    this.adjacencyList.get(vertex).forEach((v) => {
      this.adjacencyList.get(v).delete(vertex);
    });

    // Remove key and value in map
    this.adjacencyList.delete(vertex);
  }

  addEdge(from, to) {
    if (!this.hasVertex(from) || !this.hasVertex(to)) {
      throw new Error(`${from} or ${to} vertex does not exist`);
    }

    // Add from and to vertex to each Set
    this.adjacencyList.get(from).add(to);
    this.adjacencyList.get(to).add(from);
  }

  removeEdge(from, to) {
    if (!this.hasVertex(from) || !this.hasVertex(to)) {
      throw new Error(`${from} or ${to} vertex does not exist`);
    }

    // Remove from and to vertex to each Set
    this.adjacencyList.get(from).delete(to);
    this.adjacencyList.get(to).delete(from);
  }

  searchVertex(vertex) {
    // Return an array which are connected to vertex
    return [...this.adjacencyList.get(vertex)];
  }

  // Using breadth-first search to find all reachable vertices
  findAllReachableVertices(vertex) {
    if (!this.hasVertex(vertex)) {
      throw new Error(`${vertex} vertex does not exist`);
    }

    const visited = new Set();
    const queue = [vertex];

    while (queue.length > 0) {
      const currentNode = queue.shift();
      const destinations = this.adjacencyList.get(currentNode);

      for (const dest of destinations) {
        if (!visited.has(dest)) {
          visited.add(dest);
          queue.push(dest);
        }
      }
    }

    if (!this.adjacencyList.get(vertex).has(vertex)) {
      visited.delete(vertex);
    }

    return [...visited];
  }

  // Using depth-first search to find all possible paths
  findAllPaths(from, to, visited = [], allPaths = []) {
    if (!this.hasVertex(from) || !this.hasVertex(to)) {
      throw new Error(`${from} or ${to} vertex does not exist`);
    }

    visited.push(from);

    if (from === to) {
      allPaths.push([...visited]);
      return;
    }

    // Get child vertices from current vertex
    const destinations = this.adjacencyList.get(from);

    // Travel child vertex when it is not in visited array
    for (const dest of destinations) {
      if (visited.indexOf(dest) < 0) {
        this.findAllPaths(dest, to, visited, allPaths);

        // Remove last vertex when the child vertex
        // 1. traveled all child vertex
        // 2. the child vertex is the target vertex
        visited.pop();
      }
    }

    // Return all possible paths sorted by the path length
    return allPaths.sort((a, b) => a.length - b.length);
  }
}
