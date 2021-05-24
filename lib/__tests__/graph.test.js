import Graph from '../graph.js';

describe('Graph class', () => {
	let graph;

	beforeAll(() => {
		graph = new Graph();
	});

	test('constructor: should create a map object', () => {
		expect(graph.adjacencyList instanceof Map).toBe(true);
	});

	test('addVertex: should adds a vertex to graph', () => {
		graph.addVertex('a');
		expect(graph.adjacencyList.size).toBe(1);
		expect(graph.adjacencyList.has('a')).toBe(true);
	});
});
