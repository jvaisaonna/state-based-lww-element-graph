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

function runSearchVertex(graphs, vertex) {
  graphs.forEach((graph, i) => {
    log('Replica %s%s', i + 1, new Array(51).join('-'));

    const results = graph.searchVertex(vertex);

    log(`[INFO] Search vertex: ${vertex} ${results.length} vertices found`);
    log(results);
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
  replica1.addEdge('Jason', 'Hayley', t);
  replica1.addEdge('Leo', 'Steven', t);

  replica2.addVertex('Tim', t);
  replica2.addEdge('Jason', 'Tim', t);

  replica3.addVertex('Peter', t);
  replica3.addVertex('Ryan', t);
  replica3.removeVertex('Jordan', t);

  replica1.merge(replica2);
  replica1.merge(replica3);
  replica2.merge(replica1);
  replica3.merge(replica1);

  // At timestamp: 3
  t = 3;
  replica1.addEdge('Jason', 'Steven', t);
  replica1.removeEdge('Jason', 'Hayley', t);

  replica2.addVertex('Jordan', t);
  replica2.removeVertex('Hayley', t);
  replica2.removeEdge('Leo', 'Steven', t);

  replica3.addEdge('Tim', 'Peter', t);

  replica1.merge(replica2);
  replica1.merge(replica3);
  replica2.merge(replica1);
  replica3.merge(replica1);

  // At timestamp: 4
  t = 4;
  replica1.addEdge('Jason', 'Leo', t);
  replica1.addEdge('Jason', 'Tim', t);

  replica3.addEdge('Leo', 'Steven', t);
  replica3.addEdge('Ryan', 'Jordan', t);

  replica1.merge(replica2);
  replica1.merge(replica3);
  replica2.merge(replica1);
  replica3.merge(replica1);

  // At timestamp: 5
  t = 5;

  // At timestamp: 6
  t = 6;

  // log('Replica 1%s', new Array(50).join('-'));
  // log(replica1.graph);

  // log('Replica 2%s', new Array(50).join('-'));
  // log(replica2.graph);

  // log('Replica 3%s', new Array(50).join('-'));
  // log(replica3.graph);

  // The paths between two vertex
  const from = 'Peter';
  const to = 'Leo';

  runFindPath(
    [replica1, replica2, replica3].map((value) => value.graph),
    from,
    to
  );

  runSearchVertex(
    [replica1, replica2, replica3].map((value) => value.graph),
    'Jason'
  );
}

testCrdtGraph();
