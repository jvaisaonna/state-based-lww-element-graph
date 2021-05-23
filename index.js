import log from "fancy-log";
import Graph from "./lib/graph.js";
import LwwTwoPhaseSet from "./lib/lwwTwoPhaseSet.js";

const tps1 = new LwwTwoPhaseSet();
const tps2 = new LwwTwoPhaseSet();

tps1.add("a", 1);
tps1.add("b", 2);
tps1.add("c", 3);

tps2.add("d", 1);
tps2.add("e", 2);

tps1.merge(tps2);
tps2.merge(tps1);

tps1.remove("d", 4);
tps1.add("d", 4);

tps2.merge(tps1);

log(tps1.list());
log(tps2.list());

// DATA
// const airports = "PHX BKK OKC JFK LAX MEX EZE HEL LOS LAP LIM".split(" ");
// const routes = [
//   ["PHX", "LAX"],
//   ["PHX", "JFK"],
//   ["JFK", "OKC"],
//   ["JFK", "HEL"],
//   ["JFK", "LOS"],
//   ["MEX", "LAX"],
//   ["MEX", "BKK"],
//   ["MEX", "LIM"],
//   ["MEX", "EZE"],
//   ["LIM", "BKK"],
//   ["BKK", "PHX"],
//   ["OKC", "LIM"],
// ];

// const airportGraph = new Graph();

// airports.forEach((v) => airportGraph.addVertex(v));
// routes.forEach((v) => airportGraph.addEdge(...v));
// log(airportGraph.adjacencyList);

// console.log(airportGraph.findAllPaths("PHX", "OKC"));
// airportGraph.findAllPaths("LIM", "PHX");

// const vertices = "Jason Faye Iris Tom Tony Anson Bella Kenneth Ken Ben Steven".split(" ");
// const routes = [
//   ["Jason", "Faye"],
//   ["Jason", "Tony"],
//   ["Jason", "Iris"],
//   ["Tony", "Tom"],
//   ["Iris", "Faye"],
//   ["Iris", "Anson"],
//   ["Anson", "Kenneth"],
//   ["Tom", "Ken"],
//   ["Bella", "Ben"],
//   ["Tom", "Steven"],
//   ["Ken", "Steven"],
// ];

// const myGraph = new Graph();

// // Data input
// vertices.forEach((v) => myGraph.addVertex(v));
// routes.forEach((v) => myGraph.addEdge(...v));
// log(myGraph.adjacencyList);

// // The paths between two vertex
// const from = "Kenneth";
// const to = "Ben";
// const paths = myGraph.findAllPaths(from, to);
// log(`${from} to ${to}: ${paths.length} paths found`);
// paths.forEach((path) => log(path.join(" -> ")));
