import log from "fancy-log";
import Graph from "./graph.js";

// DATA
const airports = "PHX BKK OKC JFK LAX MEX EZE HEL LOS LAP LIM".split(" ");
const routes = [
  ["PHX", "LAX"],
  ["PHX", "JFK"],
  ["JFK", "OKC"],
  ["JFK", "HEL"],
  ["JFK", "LOS"],
  ["MEX", "LAX"],
  ["MEX", "BKK"],
  ["MEX", "LIM"],
  ["MEX", "EZE"],
  ["LIM", "BKK"],
];

const airportGraph = new Graph();

airports.forEach((v) => airportGraph.addVertex(v));
routes.forEach((v) => airportGraph.addEdge(...v));

log(airportGraph.adjacencyList);

airportGraph.removeVertex("PHX");

log(airportGraph.adjacencyList);

airportGraph.removeEdge("BKK", "MEX");

log(airportGraph.adjacencyList);
