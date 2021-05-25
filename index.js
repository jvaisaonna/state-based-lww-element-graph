import log from 'fancy-log';
import Graph from './lib/graph.js';
import LwwTwoPhaseSet from './lib/lwwTwoPhaseSet.js';
import StateBasedLwwElementGraph from './lib/stateBasedLwwElementGraph.js';

function runFindPath(graphs, from, to) {
	graphs.forEach((graph, i) => {
		log('Replica %s%s', i + 1, new Array(51).join('-'));

		const paths = graph.findAllPaths(from, to);

		log(`[INFO] ${from} to ${to}: ${paths.length} paths found`);
		paths.forEach((path) => log(path.join(' -> ')));

		log('%s', new Array(60).join('-'));
	});
}

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
	const crdtGraph3 = new StateBasedLwwElementGraph();

	// Data
	const vertices = 'Jason Faye Iris Tom Tony Anson Bella Kenneth Ken Ben Steven'.split(' ');
	const routes = [
		// ['Jason', 'Faye'],
		// ['Jason', 'Tony'],
		// ['Jason', 'Iris'],
		// ['Tony', 'Tom'],
		// ['Iris', 'Faye'],
		// ['Iris', 'Anson'],
		// ['Anson', 'Kenneth'],
		// ['Tom', 'Ken'],
		// ['Bella', 'Ben'],
		// ['Tom', 'Steven'],
		// ['Ken', 'Steven'],
	];

	crdtGraph1.addVertex('Jason');
	crdtGraph1.addVertex('Faye');
	crdtGraph1.addVertex('Iris');
	crdtGraph1.addVertex('Anson');
	crdtGraph1.addVertex('Tony');

	crdtGraph1.addEdge('Jason', 'Faye');
	crdtGraph1.addEdge('Jason', 'Tony');
	crdtGraph1.addEdge('Jason', 'Iris');
	crdtGraph1.addEdge('Faye', 'Iris');
	crdtGraph1.addEdge('Iris', 'Anson');

	crdtGraph2.addVertex('Tom');
	crdtGraph2.addVertex('Ken');
	crdtGraph2.addVertex('Steven');

	crdtGraph2.addEdge('Ken', 'Tom');
	crdtGraph2.addEdge('Steven', 'Tom');
	crdtGraph2.addEdge('Steven', 'Ken');

	crdtGraph3.addVertex('Bella');
	crdtGraph3.addVertex('Ben');
	crdtGraph3.addVertex('Kenneth');

	crdtGraph3.addEdge('Bella', 'Ben');

	crdtGraph3.merge(crdtGraph1);
	crdtGraph1.merge(crdtGraph2);
	// crdtGraph2.merge(crdtGraph1);

	crdtGraph1.addEdge('Tony', 'Tom');
	crdtGraph3.addEdge('Anson', 'Kenneth');

	// log('Replica 1%s', new Array(50).join('-'));
	// log(crdtGraph1.graph);

	// log('Replica 2%s', new Array(50).join('-'));
	// log(crdtGraph2.graph);

	// log('Replica 3%s', new Array(50).join('-'));
	// log(crdtGraph3.graph);

	// The paths between two vertex
	const from = 'Iris';
	const to = 'Jason';

	runFindPath(
		[crdtGraph1, crdtGraph2, crdtGraph3].map((value) => value.graph),
		from,
		to
	);

	log('[INFO] Merge replica 3 into replica 1');
	crdtGraph1.merge(crdtGraph3);

	runFindPath(
		[crdtGraph1, crdtGraph2, crdtGraph3].map((value) => value.graph),
		from,
		to
	);

	crdtGraph3.removeEdge('Anson', 'Kenneth');

	log('[INFO] Merge replica 3 into replica 1');
	crdtGraph2.merge(crdtGraph3);

	runFindPath(
		[crdtGraph1, crdtGraph2, crdtGraph3].map((value) => value.graph),
		from,
		to
	);
}

function testCrdtGraph2() {
	const crdtGraph1 = new StateBasedLwwElementGraph();
	const crdtGraph2 = new StateBasedLwwElementGraph();
	const crdtGraph3 = new StateBasedLwwElementGraph();

	crdtGraph1.addVertex('a', 1);
	crdtGraph1.addVertex('b', 1);
	crdtGraph1.addVertex('c', 1);

	crdtGraph1.addEdge('a', 'b', 1);
	crdtGraph1.addEdge('a', 'c', 1);

	crdtGraph2.addVertex('a', 1);
	crdtGraph2.addVertex('b', 1);
	crdtGraph2.addVertex('d', 1);

	crdtGraph2.addEdge('a', 'd', 1);
	crdtGraph2.addEdge('b', 'd', 1);

	// log('Replica 1%s', new Array(50).join('-'));
	// log(crdtGraph1.graph);

	// log('Replica 2%s', new Array(50).join('-'));
	// log(crdtGraph2.graph);

	// log('Replica 3%s', new Array(50).join('-'));
	// log(crdtGraph3.graph);

	// The paths between two vertex
	const from = 'b';
	const to = 'c';

	runFindPath(
		[crdtGraph1, crdtGraph2, crdtGraph3].map((value) => value.graph),
		from,
		to
	);

	log();
	log('[INFO] Merge replica 1 into replica 2');
	crdtGraph2.merge(crdtGraph1);

	runFindPath(
		[crdtGraph1, crdtGraph2, crdtGraph3].map((value) => value.graph),
		from,
		to
	);

	crdtGraph2.removeEdge('c', 'a', 2);

	log();
	log('[INFO] Merge replica 2 into replica 3');
	crdtGraph3.merge(crdtGraph2);

	crdtGraph3.addEdge('c', 'a', 3);

	runFindPath(
		[crdtGraph1, crdtGraph2, crdtGraph3].map((value) => value.graph),
		from,
		to
	);

	log();
	log('[INFO] Merge replica 3 into replica 1 & 2');
	crdtGraph1.merge(crdtGraph3);
	crdtGraph2.merge(crdtGraph3);
	runFindPath(
		[crdtGraph1, crdtGraph2, crdtGraph3].map((value) => value.graph),
		from,
		to
	);
}

function testCrdtGraph3() {
	const replica1 = new StateBasedLwwElementGraph();
	const replica2 = new StateBasedLwwElementGraph();
	const replica3 = new StateBasedLwwElementGraph();

	let t = 1;

	// At timestamp: 1
	replica1.addVertex('Jason', t);
	replica1.addVertex('Hayley', t);

	replica2.addVertex('Leo', t);

	replica3.addVertex('Jordan', t);

	replica1.merge(replica2);
	replica2.merge(replica1);

	// At timestamp: 2
	t = 2;
	replica1.addVertex('Steven', t);
	replica1.addEdge('Jason', 'Steven', t);
	replica1.addEdge('Leo', 'Steven', t);

	replica2.addVertex('Tim', t);
	replica2.addEdge('Jason', 'Tim', t);
	replica2.removeVertex('Hayley', t);

	replica3.addVertex('Peter', t);
	replica3.addVertex('Ryan', t);
	replica3.removeVertex('Jordan', t);

	replica1.merge(replica2);
	replica2.merge(replica1);

	// At timestamp: 3
	t = 3;
	replica1.removeEdge('Leo', 'Steven', t);

	replica2.addVertex('Jordan', t);
	replica2.removeEdge('Jason', 'Leo', t);
	replica2.removeEdge('Jason', 'Steven', t);

	replica1.merge(replica2);
	replica1.merge(replica3);
	replica2.merge(replica1);
	replica3.merge(replica1);

	// At timestamp: 4
	t = 4;
	replica1.addEdge('Jason', 'Steven', t);

	replica3.addEdge('Ryan', 'Jordan', t);

	// At timestamp: 5
	t = 5;

	// At timestamp: 6
	t = 6;

	// log('Replica 1%s', new Array(50).join('-'));
	// log(crdtGraph1.graph);

	// log('Replica 2%s', new Array(50).join('-'));
	// log(crdtGraph2.graph);

	// log('Replica 3%s', new Array(50).join('-'));
	// log(crdtGraph3.graph);

	// The paths between two vertex
	const from = 'b';
	const to = 'c';

	runFindPath(
		[crdtGraph1, crdtGraph2, crdtGraph3].map((value) => value.graph),
		from,
		to
	);

	log();
	log('[INFO] Merge replica 1 into replica 2');
	crdtGraph2.merge(crdtGraph1);

	runFindPath(
		[crdtGraph1, crdtGraph2, crdtGraph3].map((value) => value.graph),
		from,
		to
	);

	crdtGraph2.removeEdge('c', 'a', 2);

	log();
	log('[INFO] Merge replica 2 into replica 3');
	crdtGraph3.merge(crdtGraph2);

	crdtGraph3.addEdge('c', 'a', 3);

	runFindPath(
		[crdtGraph1, crdtGraph2, crdtGraph3].map((value) => value.graph),
		from,
		to
	);

	log();
	log('[INFO] Merge replica 3 into replica 1 & 2');
	crdtGraph1.merge(crdtGraph3);
	crdtGraph2.merge(crdtGraph3);
	runFindPath(
		[crdtGraph1, crdtGraph2, crdtGraph3].map((value) => value.graph),
		from,
		to
	);
}

testCrdtGraph3();
