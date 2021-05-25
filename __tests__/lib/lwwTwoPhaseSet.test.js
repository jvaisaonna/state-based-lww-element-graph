import { jest } from '@jest/globals';
import LwwTwoPhaseSet, { SetElement } from '../../lib/lwwTwoPhaseSet.js';

describe('LwwTwoPhaseSet', () => {
	let twoPhaseSet;

	beforeEach(() => {
		jest.spyOn(Date, 'now').mockImplementation(() => 1560312000);
		twoPhaseSet = new LwwTwoPhaseSet();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	test('constructor: should create 2 sets of add and remove', () => {
		expect(twoPhaseSet.addSet instanceof Set).toBe(true);
		expect(twoPhaseSet.removeSet instanceof Set).toBe(true);
	});

	describe('add', () => {
		test('should add a SetElement to addSet', () => {
			twoPhaseSet.add('a', 1);

			const [newElement] = [...twoPhaseSet.addSet];

			expect(twoPhaseSet.addSet.size).toBe(1);
			expect(newElement instanceof SetElement).toBe(true);
			expect(newElement).toEqual(new SetElement('a', 1));
		});

		test('should add a SetElement with Date.now() to addSet', () => {
			twoPhaseSet.add('a');

			const [newElement] = [...twoPhaseSet.addSet];

			expect(twoPhaseSet.addSet.size).toBe(1);
			expect(newElement instanceof SetElement).toBe(true);
			expect(newElement).toEqual(new SetElement('a', 1560312000));
		});
	});

	describe('remove', () => {
		test('should add a SetElement to removeSet when addSet contains the element', () => {
			jest.spyOn(twoPhaseSet, 'lookup').mockImplementation(() => true);

			twoPhaseSet.remove('a', 2);

			const [newElement] = [...twoPhaseSet.removeSet];

			expect(twoPhaseSet.removeSet.size).toBe(1);
			expect(newElement instanceof SetElement).toBe(true);
			expect(newElement).toEqual(new SetElement('a', 2));
		});

		test('should add a SetElement with Date.now() to removeSet', () => {
			jest.spyOn(twoPhaseSet, 'lookup').mockImplementation(() => true);

			twoPhaseSet.remove('a');

			const [newElement] = [...twoPhaseSet.removeSet];

			expect(twoPhaseSet.removeSet.size).toBe(1);
			expect(newElement instanceof SetElement).toBe(true);
			expect(newElement).toEqual(new SetElement('a', 1560312000));
		});

		test('should throw an error when addSet contains the element', () => {
			expect(() => twoPhaseSet.remove('a', 2)).toThrow('a element does not exist or has been removed');
			expect(twoPhaseSet.removeSet.size).toBe(0);
		});
	});

	describe('merge', () => {
		test('should merge in union with incoming 2P-Set', () => {
			const tempTwoPhaseSet = new LwwTwoPhaseSet();

			twoPhaseSet.add('a', 1);
			twoPhaseSet.add('b', 1);
			twoPhaseSet.remove('b', 2);

			tempTwoPhaseSet.add('b', 1);
			tempTwoPhaseSet.add('c', 1);
			tempTwoPhaseSet.remove('c', 2);

			twoPhaseSet.merge(tempTwoPhaseSet);

			expect(twoPhaseSet.addSet.size).toBe(4);
			expect([...twoPhaseSet.addSet]).toEqual([
				{ timestamp: 1, value: 'a' },
				{ timestamp: 1, value: 'b' },
				{ timestamp: 1, value: 'b' },
				{ timestamp: 1, value: 'c' },
			]);
			expect(twoPhaseSet.removeSet.size).toBe(2);
			expect([...twoPhaseSet.removeSet]).toEqual([
				{ timestamp: 2, value: 'b' },
				{ timestamp: 2, value: 'c' },
			]);
		});
	});

	describe('lookup', () => {
		test('should return true when the element in addSet, but not removeSet', () => {
			twoPhaseSet.add('a', 1);
			twoPhaseSet.add('b', 2);

			expect(twoPhaseSet.lookup('a')).toBe(true);
			expect(twoPhaseSet.lookup('b')).toBe(true);
		});

		test('should return true when the element in addSet with higher timestamp', () => {
			twoPhaseSet.add('a', 1);
			twoPhaseSet.add('b', 2);
			twoPhaseSet.remove('b', 3);
			twoPhaseSet.add('b', 4);

			expect(twoPhaseSet.lookup('a')).toBe(true);
			expect(twoPhaseSet.lookup('b')).toBe(true);
		});

		test('should return false when the element not in addSet', () => {
			expect(twoPhaseSet.lookup('a')).toBe(false);
		});

		test('should return false when the element in removeSet with higher timestamp', () => {
			twoPhaseSet.add('a', 1);
			twoPhaseSet.add('b', 2);
			twoPhaseSet.remove('b', 3);

			expect(twoPhaseSet.lookup('a')).toBe(true);
			expect(twoPhaseSet.lookup('b')).toBe(false);
		});
	});

	describe('lookupAll', () => {
		test('should return an array with existing elements', () => {
			twoPhaseSet.add('a', 1);
			twoPhaseSet.add('b', 1);
			twoPhaseSet.add('c', 1);

			twoPhaseSet.remove('a', 2);
			twoPhaseSet.remove('c', 2);

			twoPhaseSet.add('a', 3);

			expect([...twoPhaseSet.lookupAll()]).toEqual(['a', 'b']);
		});
	});
});
