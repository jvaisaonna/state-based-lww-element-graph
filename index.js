import log from 'fancy-log';
import Graph from './lib/graph.js';
import LwwTwoPhaseSet from './lib/lwwTwoPhaseSet.js';
import StateBasedLwwElementGraph from './lib/stateBasedLwwElementGraph.js';

function testAirportGraph() {
	// Data
	const airports = 'PHX BKK OKC JFK LAX MEX EZE HEL LOS LAP LIM'.split(' ');
	const routes = [
		['PHX', 'LAX'],
		['PHX', 'JFK'],
		['JFK', 'OKC'],
		['JFK', 'HEL'],
		['JFK', 'LOS'],
		['MEX', 'LAX'],
		['MEX', 'BKK'],
		['MEX', 'LIM'],
		['MEX', 'EZE'],
		['LIM', 'BKK'],
		['BKK', 'PHX'],
		['OKC', 'LIM'],
	];

	const airportGraph = new Graph();

	// Data input
	airports.forEach((v) => airportGraph.addVertex(v));
	routes.forEach((v) => airportGraph.addEdge(...v));
	log(airportGraph.adjacencyList);

	console.log(airportGraph.findAllPaths('PHX', 'OKC'));
}

function testPeopleNetworkGraph() {
	// Data
	const vertices = 'Jason Faye Iris Tom Tony Anson Bella Kenneth Ken Ben Steven'.split(' ');
	const routes = [
		['Jason', 'Faye'],
		['Jason', 'Tony'],
		['Jason', 'Iris'],
		['Tony', 'Tom'],
		['Iris', 'Faye'],
		['Iris', 'Anson'],
		['Anson', 'Kenneth'],
		['Tom', 'Ken'],
		['Bella', 'Ben'],
		['Tom', 'Steven'],
		['Ken', 'Steven'],
	];

	const myGraph = new Graph();

	// Data input
	vertices.forEach((v) => myGraph.addVertex(v));
	routes.forEach((v) => myGraph.addEdge(...v));
	log(myGraph.adjacencyList);

	// The paths between two vertex
	const from = 'Kenneth';
	const to = 'Jason';
	const paths = myGraph.findAllPaths(from, to);

	log(`${from} to ${to}: ${paths.length} paths found`);
	paths.forEach((path) => log(path.join(' -> ')));
}

function testLww2PhaseSet() {
	const tps1 = new LwwTwoPhaseSet();
	const tps2 = new LwwTwoPhaseSet();

	tps1.add('a', 1);
	tps1.add('b', 1);
	tps1.add('c', 1);
	tps1.add('d', 2);
	tps1.remove('a', 3);
	tps1.remove('a', 4);
	tps1.add('a', 5);

	tps2.add('d', 1);
	tps2.add('e', 2);

	tps1.merge(tps2);
	tps2.merge(tps1);

	tps1.remove('d', 4);

	log(tps1.list());
	log(tps2.list());
}

function testCrdtGraph() {
	const crdtGraph1 = new StateBasedLwwElementGraph();
	const crdtGraph2 = new StateBasedLwwElementGraph();

 // Data
	const vertices = 'Jason Faye Iris Tom Tony Anson Bella Kenneth Ken Ben Steven'.split(' ');
	const routes = [
		// ['Jason', 'Faye'],
		['Jason', 'Tony'],
		// ['Jason', 'Iris'],
		['Tony', 'Tom'],
		// ['Iris', 'Faye'],
		// ['Iris', 'Anson'],
		['Anson', 'Kenneth'],
		// ['Tom', 'Ken'],
		['Bella', 'Ben'],
		// ['Tom', 'Steven'],
		// ['Ken', 'Steven'],
	];

 crdtGraph1.addVertex("Jason");
 crdtGraph1.addVertex("Faye");
 crdtGraph1.addVertex("Iris");
 crdtGraph1.addVertex("Anson");
 crdtGraph1.addVertex("Tony");

 crdtGraph1.addEdge("Jason", "Faye");
 crdtGraph1.addEdge("Jason", "Tony");
 crdtGraph1.addEdge("Jason", "Iris");
 crdtGraph1.addEdge("Faye", "Iris");
 crdtGraph1.addEdge("Iris", "Anson");


 crdtGraph2.addVertex("Tom");
 crdtGraph2.addVertex("Ken");
 crdtGraph2.addVertex("Bella");
 crdtGraph2.addVertex("Steven");

 crdtGraph2.addEdge("Tony", "Tom");
 crdtGraph2.addEdge("Ken", "Tom");
 crdtGraph2.addEdge("Steven", "Tom");
 crdtGraph2.addEdge("Steven", "Ken");


 crdtGraph1.merge(crdtGraph2);
 crdtGraph2.merge(crdtGraph1);

 crdtGraph2.addEdge("Tony", "Tom");
 
 log(crdtGraph1.graph);
 log(crdtGraph2.graph);

 // The paths between two vertex
	// const from = 'Faye';
	// const to = 'Tony';
	// const paths = crdtGraph1.graph.findAllPaths(from, to);

	// log(`${from} to ${to}: ${paths.length} paths found`);
	// paths.forEach((path) => log(path.join(' -> ')));
}

testCrdtGraph();
