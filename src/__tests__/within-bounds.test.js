import { assert, test } from '../../test-utils/test.js';

import { withinBounds } from '../resize-utils.js';

const testRect = {
  top: 0,
  right: 200,
  bottom: 120,
  left: 20,
};
const testTolerance = 2;
const withinTestBounds = withinBounds(testRect, testTolerance);

test('withinBounds returns true if (x, y) within bounding rect', () => {
  const actualTopLeft = withinTestBounds(18, -2);
  const actualTopRight = withinTestBounds(202, -2);
  const actualBottomLeft = withinTestBounds(22, 121);
  const actualBottomRight = withinTestBounds(190, 119);
  const actualMiddle = withinTestBounds(100, 60);
  const expected = true;

  assert.deepEqual(actualTopLeft, expected);
  assert.deepEqual(actualTopRight, expected);
  assert.deepEqual(actualBottomLeft, expected);
  assert.deepEqual(actualBottomRight, expected);
  assert.deepEqual(actualMiddle, expected);
});

test('withinBounds returns false if (x, y) outside bounding rect', () => {
  const actual = withinTestBounds(10, 226);
  const expected = false;

  assert.deepEqual(actual, expected);
});
