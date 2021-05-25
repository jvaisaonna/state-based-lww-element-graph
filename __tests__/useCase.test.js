import { jest } from '@jest/globals';
import StateBasedLwwElementGraph from '../lib/stateBasedLwwElementGraph.js';

describe('Actual use cases', () => {
  describe('People network', () => {
    let replica1;
    let replica2;
    let replica3;

    beforeEach(() => {
      replica1 = new StateBasedLwwElementGraph();
      replica2 = new StateBasedLwwElementGraph();
      replica3 = new StateBasedLwwElementGraph();

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
    });

    test('all replicas should return the same searchVertex result', () => {
      const vertex = 'Jason';

      const replica1Result = replica1.graph.searchVertex(vertex);
      const replica2Result = replica2.graph.searchVertex(vertex);
      const replica3Result = replica3.graph.searchVertex(vertex);

      expect(replica1Result).toEqual(replica2Result);
      expect(replica2Result).toEqual(replica3Result);
    });

    test('all replicas should return the same findAllReachableVertices result', () => {
      const vertex = 'Jason';

      const replica1Result = replica1.graph.findAllReachableVertices(vertex);
      const replica2Result = replica2.graph.findAllReachableVertices(vertex);
      const replica3Result = replica3.graph.findAllReachableVertices(vertex);

      expect(replica1Result).toEqual(replica2Result);
      expect(replica2Result).toEqual(replica3Result);
    });

    test('all replicas should return the same findAllPaths result', () => {
      const from = 'Peter';
      const to = 'Leo';

      const replica1Result = replica1.graph.findAllPaths(from, to);
      const replica2Result = replica2.graph.findAllPaths(from, to);
      const replica3Result = replica3.graph.findAllPaths(from, to);

      expect(replica1Result.length).toBe(2);
      expect(replica2Result.length).toBe(2);
      expect(replica3Result.length).toBe(2);
      expect(replica1Result).toEqual(replica2Result);
      expect(replica2Result).toEqual(replica3Result);
    });
  });
});
