import StateBasedLwwElementGraph from './lib/stateBasedLwwElementGraph.js';

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

const vertex = 'Jason';
let result;

// Run graph.searchVertex for each replicas
result = replica1.graph.searchVertex(vertex); // Tim,Steven,Leo
console.log(`Replica1 - searchVertex(${vertex}): ${result.length} vertices found\n${result}\n`);

result = replica2.graph.searchVertex(vertex); // Tim,Steven,Leo
console.log(`Replica2 - searchVertex(${vertex}): ${result.length} vertices found\n${result}\n`);

result = replica3.graph.searchVertex(vertex); // Tim,Steven,Leo
console.log(`Replica3 - searchVertex(${vertex}): ${result.length} vertices found\n${result}\n`);

// Run graph.findAllReachableVertices for each replicas
result = replica1.graph.findAllReachableVertices(vertex); // Tim,Steven,Leo,Peter
console.log(
  `Replica1 - findAllReachableVertices(${vertex}): ${result.length} vertices found\n${result}\n`
);

result = replica2.graph.findAllReachableVertices(vertex); // Tim,Steven,Leo,Peter
console.log(
  `Replica2 - findAllReachableVertices(${vertex}): ${result.length} vertices found\n${result}\n`
);

result = replica3.graph.findAllReachableVertices(vertex); // Tim,Steven,Leo,Peter
console.log(
  `Replica3 - findAllReachableVertices(${vertex}): ${result.length} vertices found\n${result}\n`
);

// Run graph.findAllPaths for each replicas
const from = 'Peter';
const to = 'Leo';

result = replica1.graph.findAllPaths(from, to); // [[Peter,Tim,Jason,Leo], [Peter,Tim,Jason,Steven,Leo]]
console.log(`Replica1 - findAllPaths(${from}, ${to}): ${result.length} paths found`);
result.forEach((path) => console.log(path.join(' -> ')));

result = replica2.graph.findAllPaths(from, to); // [[Peter,Tim,Jason,Leo], [Peter,Tim,Jason,Steven,Leo]]
console.log(`Replica2 - findAllPaths(${from}, ${to}): ${result.length} paths found`);
result.forEach((path) => console.log(path.join(' -> ')));

result = replica3.graph.findAllPaths(from, to); // [[Peter,Tim,Jason,Leo], [Peter,Tim,Jason,Steven,Leo]]
console.log(`Replica3 - findAllPaths(${from}, ${to}): ${result.length} paths found`);
result.forEach((path) => console.log(path.join(' -> ')));
