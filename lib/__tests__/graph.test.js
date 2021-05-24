import Graph from "../graph.js";

describe("Graph class", () => {
  let graph;

  beforeEach(() => {
    graph = new Graph();
  });

  test("constructor: should create a map object", () => {
    expect(graph.adjacencyList instanceof Map).toBe(true);
  });

  describe("addVertex", () => {
    test("should adds a vertex and create a Set", () => {
      graph.addVertex("a");

      expect(graph.adjacencyList.size).toBe(1);
      expect(graph.adjacencyList.has("a")).toBe(true);
      expect(graph.adjacencyList.get("a") instanceof Set).toBe(true);
    });

    test("should not add duplicated vertex", () => {
      graph.addVertex("a");
      graph.addVertex("a");

      expect(graph.adjacencyList.size).toBe(1);
      expect(graph.adjacencyList.has("a")).toBe(true);
    });
  });

  describe("removeVertex", () => {
    test("should remove a vertex", () => {
      graph.addVertex("a");
      expect(graph.adjacencyList.size).toBe(1);
      expect(graph.adjacencyList.has("a")).toBe(true);

      graph.removeVertex("a");
      expect(graph.adjacencyList.size).toBe(0);
      expect(graph.adjacencyList.has("a")).toBe(false);
    });

    test("should remove a vertex with all dependencies in other vertex set", () => {
      graph.addVertex("a");
      graph.addVertex("b");
      graph.addVertex("c");

      graph.addEdge("a", "b");
      graph.addEdge("a", "c");

      expect(graph.adjacencyList.size).toBe(3);
      expect(graph.adjacencyList.get("b").has("a")).toBe(true);
      expect(graph.adjacencyList.get("c").has("a")).toBe(true);

      graph.removeVertex("a");
      expect(graph.adjacencyList.size).toBe(2);
      expect(graph.adjacencyList.get("b").has("a")).toBe(false);
      expect(graph.adjacencyList.get("c").has("a")).toBe(false);
    });

    test("should throw an error when no corresponding vertex", () => {
      expect(() => graph.removeVertex("a")).toThrow("a vertex does not exist");
    });
  });

  describe("addEdge", () => {
    test("should add an edge", () => {
      graph.addVertex("a");
      graph.addVertex("b");
      graph.addEdge("a", "b");

      expect(graph.adjacencyList.get("a").has("b")).toBe(true);
      expect(graph.adjacencyList.get("b").has("a")).toBe(true);
    });

    test("should throw an error when no corresponding vertex", () => {
      expect(() => graph.addEdge("a", "b")).toThrow("a or b vertex does not exist");

      graph.addVertex("a");

      expect(() => graph.addEdge("a", "b")).toThrow("a or b vertex does not exist");
      expect(() => graph.addEdge("b", "a")).toThrow("b or a vertex does not exist");
    });
  });

  describe("removeEdge", () => {
    test("should remove an edge", () => {
      graph.addVertex("a");
      graph.addVertex("b");
      graph.addEdge("a", "b");
      expect(graph.adjacencyList.get("a").has("b")).toBe(true);
      expect(graph.adjacencyList.get("b").has("a")).toBe(true);

      graph.removeEdge("a", "b");
      expect(graph.adjacencyList.get("a").has("b")).toBe(false);
      expect(graph.adjacencyList.get("b").has("a")).toBe(false);
    });

    test("should throw error when no corresponding vertex", () => {
      expect(() => graph.removeEdge("a", "b")).toThrow("a or b vertex does not exist");

      graph.addVertex("a");
      expect(() => graph.removeEdge("a", "b")).toThrow("a or b vertex does not exist");
      expect(() => graph.removeEdge("b", "a")).toThrow("b or a vertex does not exist");
    });
  });

  describe("hasVertex", () => {
    test("should return true", () => {
      graph.addVertex("a");

      expect(graph.hasVertex("a")).toBe(true);
    });

    test("should return false", () => {
      expect(graph.hasVertex("a")).toBe(false);
    });
  });

  describe("searchVertex", () => {
    test("should get an array with 'b' and 'c' vertices", () => {
      graph.addVertex("a");
      graph.addVertex("b");
      graph.addVertex("c");

      graph.addEdge("a", "b");
      graph.addEdge("a", "c");

      expect(`${graph.searchVertex("a")}`).toBe(`${["b", "c"]}`);
    });
  });

  describe("findAllReachableVertices", () => {
    test("should found 4 vertices", () => {
      const vertices = "a b c d e f g".split(" ");
      const routes = [
        ["a", "b"],
        ["a", "c"],
        ["b", "d"],
        ["b", "e"],
        ["f", "g"],
      ];

      vertices.forEach((v) => graph.addVertex(v));
      routes.forEach((v) => graph.addEdge(...v));

      expect(graph.findAllReachableVertices("a").length).toBe(4);
    });

    test("should found 5 vertices if it has self route", () => {
      const vertices = "a b c d e f g".split(" ");
      const routes = [
        ["a", "b"],
        ["a", "c"],
        ["b", "d"],
        ["b", "e"],
        ["f", "g"],
        ["a", "a"],
      ];

      vertices.forEach((v) => graph.addVertex(v));
      routes.forEach((v) => graph.addEdge(...v));

      expect(graph.findAllReachableVertices("a").length).toBe(5);
    });

    test("should throw an error when no corresponding vertex", () => {
      expect(() => graph.findAllReachableVertices("a")).toThrow("a vertex does not exist");
    });
  });

  describe("findAllPaths", () => {
    test("should found 2 possible paths", () => {
      const vertices = "a b c d".split(" ");
      const routes = [
        ["a", "b"],
        ["a", "c"],
        ["b", "d"],
        ["d", "c"],
      ];

      vertices.forEach((v) => graph.addVertex(v));
      routes.forEach((v) => graph.addEdge(...v));

      expect(graph.findAllPaths("a", "d").length).toBe(2);
    });

    test("should throw error when no corresponding vertex", () => {
      expect(() => graph.findAllPaths("a", "b")).toThrow("a or b vertex does not exist");

      graph.addVertex("a");
      expect(() => graph.findAllPaths("a", "b")).toThrow("a or b vertex does not exist");
      expect(() => graph.findAllPaths("b", "a")).toThrow("b or a vertex does not exist");
    });
  });
});
