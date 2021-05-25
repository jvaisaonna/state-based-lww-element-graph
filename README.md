# State-based Last-Write-Win-Element Graph

In this project, it implemented the data structure of Last-Write-Wins Element Graph(lww-graph) in JavaScript. In terms of lww-graph, it is the State-based [Conflict-Free Replicated Date Type](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type)(CRDT) to provide an eventual consistency data to each replicas.

## Features

- Add or remove vertex
- Add or remove edge
- Check if a vertex is in the graph
- Query for all vertices connected to a vertex
- Find all possible paths between two vertices
- Merge with concurrent changes from other graph or replica

## Usage

#### `addVertex(vertex, timestamp = Date.now())`

#### `removeVertex(vertex, timestamp = Date.now())`

#### `addEdge(from, to, timestamp = Date.now()) `

#### `removeEdge(from, to, timestamp = Date.now())`

#### `merge(incomingStateBasedLwwElementGraph)`

## Example

## Test

## References

- [https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type)
- [https://github.com/pfrazee/crdt_notes](https://github.com/pfrazee/crdt_notes)
- [https://hal.inria.fr/inria-00555588/PDF/techreport.pdf](https://hal.inria.fr/inria-00555588/PDF/techreport.pdf)
