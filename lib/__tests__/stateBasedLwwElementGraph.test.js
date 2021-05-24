import { jest } from '@jest/globals';
import LwwTwoPhaseSet from '../lwwTwoPhaseSet.js';
import StateBasedLwwElementGraph from '../stateBasedLwwElementGraph.js';

describe('StateBasedLwwElementGraph', () => {
  let dateNowSpy;
  let crdtGraph;

  beforeEach(() => {
    dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => 1560312000);
    crdtGraph = new StateBasedLwwElementGraph();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('constructor: should create 2 2P-Set of add and remove, _graph and isLatestGraph', () => {
    expect(crdtGraph.verticesSet instanceof LwwTwoPhaseSet).toBe(true);
    expect(crdtGraph.edgesSet instanceof LwwTwoPhaseSet).toBe(true);
    expect(crdtGraph._graph).toBeUndefined();
    expect(crdtGraph.isLatestGraph).toBe(false);
  });

  describe('addVertex', () => {
    test('should call the add function of verticesSet', () => {
      const addSpy = jest.spyOn(crdtGraph.verticesSet, 'add');

      crdtGraph.isLatestGraph = true;
      crdtGraph.addVertex('a', 1);

      expect(crdtGraph.isLatestGraph).toBe(false);
      expect(addSpy).toHaveBeenCalledWith('a', 1);
    });

    test('should call the add function of verticesSet with Date.now()', () => {
      const addSpy = jest.spyOn(crdtGraph.verticesSet, 'add');

      crdtGraph.isLatestGraph = true;
      crdtGraph.addVertex('a');

      expect(crdtGraph.isLatestGraph).toBe(false);
      expect(addSpy).toHaveBeenCalledWith('a', 1560312000);
    });
  });

  describe('removeVertex', () => {
    test('should call remove function of verticesSet', () => {
      jest.spyOn(crdtGraph.verticesSet, 'lookup').mockImplementation(() => true);
      const removeSpy = jest.spyOn(crdtGraph.verticesSet, 'remove');

      crdtGraph.isLatestGraph = true;
      crdtGraph.removeVertex('a', 1);

      expect(crdtGraph.isLatestGraph).toBe(false);
      expect(removeSpy).toHaveBeenCalledWith('a', 1);
    });

    test('should call remove function of verticesSet with Date.now()', () => {
      jest.spyOn(crdtGraph.verticesSet, 'lookup').mockImplementation(() => true);
      const removeSpy = jest.spyOn(crdtGraph.verticesSet, 'remove');

      crdtGraph.isLatestGraph = true;
      crdtGraph.removeVertex('a');

      expect(crdtGraph.isLatestGraph).toBe(false);
      expect(removeSpy).toHaveBeenCalledWith('a', 1560312000);
    });

    test('should throw an error when no corresponding vertex', () => {
      jest.spyOn(crdtGraph.verticesSet, 'lookup').mockImplementation(() => false);
      const removeSpy = jest.spyOn(crdtGraph.verticesSet, 'remove');

      expect(() => crdtGraph.removeVertex('a', 1)).toThrow('a vertex does not exist');
      expect(removeSpy).not.toHaveBeenCalled();
    });
  });

  describe('addEdge', () => {
    test('should call add function of edgesSet', () => {
      jest.spyOn(crdtGraph.verticesSet, 'lookup').mockImplementation(() => true);
      const addSpy = jest.spyOn(crdtGraph.edgesSet, 'add');

      crdtGraph.isLatestGraph = true;
      crdtGraph.addEdge('a', 'b', 1);

      expect(crdtGraph.isLatestGraph).toBe(false);
      expect(addSpy).toHaveBeenCalledWith('a,b', 1);
    });

    test('should call add function of edgesSet with Date.now()', () => {
      jest.spyOn(crdtGraph.verticesSet, 'lookup').mockImplementation(() => true);
      const addSpy = jest.spyOn(crdtGraph.edgesSet, 'add');

      crdtGraph.isLatestGraph = true;
      crdtGraph.addEdge('a', 'b');

      expect(crdtGraph.isLatestGraph).toBe(false);
      expect(addSpy).toHaveBeenCalledWith('a,b', 1560312000);
    });

    test('should throw an error when no corresponding vertex', () => {
      jest.spyOn(crdtGraph.verticesSet, 'lookup').mockImplementation(() => false);
      const addSpy = jest.spyOn(crdtGraph.edgesSet, 'add');

      crdtGraph.addVertex('a', 1);

      expect(() => crdtGraph.addEdge('a', 'b', 1)).toThrow('a or b vertex does not exist');
      expect(() => crdtGraph.addEdge('b', 'a', 1)).toThrow('b or a vertex does not exist');
      expect(addSpy).not.toHaveBeenCalled();
    });
  });

  describe('removeEdge', () => {
    test('should ', () => {});
  });

  describe('merge', () => {
    test('should ', () => {});
  });
});
