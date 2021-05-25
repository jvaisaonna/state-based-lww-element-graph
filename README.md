# State-based Last-Write-Win-Element Graph

## About

In this project, it implemented the data structure of Last-Write-Wins-Element Graph(lww-graph) in JavaScript. In terms of lww-graph, it is the State-based [Conflict-Free Replicated Date Type](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type)(CRDT) to provide an eventual consistency data to each replicas.

## Features

- Add or remove vertex
- Add or remove edge
- Check if a vertex is in the graph
- Query for all vertices connected to a vertex
- Find all possible paths between two vertices
- Merge with concurrent changes from other graph or replica

## Setup

Project is created with **Node.js version: v12.22.1**

### Install node modules

```bash
$ npm install
```

## Usage

### Class: Graph

#### Constructor

```javascript
new Graph();
```

#### Method: `searchVertex(vertex)`: Array

| Parameter | Type                    | Required | default |
| --------- | ----------------------- | -------- | ------- |
| vertex    | String, Number, Boolean | `true`   |         |

#### Method: `findAllReachableVertices(vertex)`: Array

| Parameter | Type                    | Required | default |
| --------- | ----------------------- | -------- | ------- |
| vertex    | String, Number, Boolean | `true`   |         |

Error will be threw if `vertex` are not exist in the graph

#### Method: `findAllPaths(from, to, visited = [], allPaths = [])`: Array

| Parameter | Type                    | Required | default |
| --------- | ----------------------- | -------- | ------- |
| from      | String, Number, Boolean | `true`   |         |
| to        | String, Number, Boolean | `true`   |         |
| visited   | Array                   | `false`  | `[]`    |
| allPaths  | Array                   | `false`  | `[]`    |

Error will be threw if `from` or `to` vertex is not exist in the graph

### Class: StateBasedLwwElementGraph

#### Property: `graph`: Graph

`graph` will return a `Graph` object with the existing vertices and edges

#### Constructor

```javascript
new StateBasedLwwElementGraph();
```

#### Method: `addVertex(vertex, timestamp = Date.now())`: void

Add a `SetElement` into `verticesSet` with provided vertex

| Parameter | Type                    | Required | default      |
| --------- | ----------------------- | -------- | ------------ |
| vertex    | String, Number, Boolean | `true`   |              |
| timestamp | Number                  | `false`  | `Date.now()` |

#### Method: `removeVertex(vertex, timestamp = Date.now())`: void

Remove a `SetElement` of provided vertex from `verticesSet`

| Parameter | Type                    | Required | default      |
| --------- | ----------------------- | -------- | ------------ |
| vertex    | String, Number, Boolean | `true`   |              |
| timestamp | Number                  | `false`  | `Date.now()` |

Error will be threw if `vertex` is not exist in the `verticesSet`

#### Method: `addEdge(from, to, timestamp = Date.now())`: void

Add an edge into `edgesSet` with provided vertices

| Parameter | Type                    | Required | default      |
| --------- | ----------------------- | -------- | ------------ |
| from      | String, Number, Boolean | `true`   |              |
| to        | String, Number, Boolean | `true`   |              |
| timestamp | Number                  | `false`  | `Date.now()` |

Error will be threw if `from` or `to` vertex is not exist in the `verticesSet`

#### Method: `removeEdge(from, to, timestamp = Date.now())`: void

Remove an edge of provided vertices from `edgesSet`

| Parameter | Type                    | Required | default      |
| --------- | ----------------------- | -------- | ------------ |
| from      | String, Number, Boolean | `true`   |              |
| to        | String, Number, Boolean | `true`   |              |
| timestamp | Number                  | `false`  | `Date.now()` |

Error will be threw if `from` to `to` edge is not exist in the `edgesSet`

#### Method: `merge(incomingStateBasedLwwElementGraph)`: void

Merge the `verticesSet` and `edgesSet` of `incomingStateBasedLwwElementGraph` into self `verticesSet` and `edgesSet`

| Parameter                         | Type                      | Required | default |
| --------------------------------- | ------------------------- | -------- | ------- |
| incomingStateBasedLwwElementGraph | StateBasedLwwElementGraph | `true`   |         |

Error will be threw if the type of `incomingStateBasedLwwElementGraph` is not `StateBasedLwwElementGraph`

## Example

## Test

## References

- [Conflict-free replicated data type](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type)
- [CRDT notes by pfrazee](https://github.com/pfrazee/crdt_notes)
- [A comprehensive study of Convergent and Commutative Replicated Data Types](https://hal.inria.fr/inria-00555588/PDF/techreport.pdf)
