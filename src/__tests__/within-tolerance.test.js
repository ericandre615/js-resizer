import { assert, test } from '../../test-utils/test.js';

import { withinTolerance } from '../resize-utils.js';

test('withinTolerance returns true if left value in tolerance of right value', () => {
  const tolerance1 = withinTolerance(18, 20);
  const tolerance2 = withinTolerance(19, 20);
  const tolerance3 = withinTolerance(20, 20);
  const tolerance4 = withinTolerance(21, 20);
  const tolerance5 = withinTolerance(22, 20);
  const expected = true;

  assert.deepEqual(tolerance1, expected, '(18, 20)');
  assert.deepEqual(tolerance2, expected, '(19, 20)');
  assert.deepEqual(tolerance3, expected, '(20, 20)');
  assert.deepEqual(tolerance4, expected, '(21, 20)');
  assert.deepEqual(tolerance5, expected, '(22, 20)');
});

test('withinTolerance returns false if left value is outside tolerance of right value', () => {
  const actualLower = withinTolerance(15, 20);
  const actualHigher = withinTolerance(26, 20);
  const expected = false;

  assert.deepEqual(actualLower, expected);
  assert.deepEqual(actualHigher, expected);
});
