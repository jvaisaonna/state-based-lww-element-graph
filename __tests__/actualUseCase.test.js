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
		});

		test('should ', () => {});
	});
});
