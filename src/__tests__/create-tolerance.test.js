import { test, assert, endTests } from '../../test-utils/test.js';
import { createTolerance } from '../resize-utils.js';

test('createTolerance: should return array in range of tolerance', (done) => {
  const tolerance = 4;
  const base = 20;
  const actual = createTolerance(base, tolerance);
  const expected = [16, 17, 18, 19, 20, 21, 22, 23, 24];

  assert.deepEqual(actual, expected);
});

test('createTolerance: should have a default tolerance of 4', () => {
  const base = 20;
  const actual = createTolerance(base);
  const expected = [18, 19, 20, 21, 22];

  assert.deepEqual(actual, expected);
});

test('createTolerance: should work with base 0', () => {
  const base = 0;
  const actual = createTolerance(base);
  const expected = [-2, -1, 0, 1, 2];

  assert.deepEqual(actual, expected);
});

test('createTolerance: should work with negative base', () => {
  const base = -2;
  const actual = createTolerance(base);
  const expected = [-4, -3, -2, -1, 0];

  assert.deepEqual(actual, expected);
});

