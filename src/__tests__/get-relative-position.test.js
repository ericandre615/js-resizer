import { assert, test } from '../../test-utils/test.js';

import { getRelativePosition } from '../resize-utils.js';

const boundingRect = {
  top: 10,
  left: 20,
  bottom: 160,
  right: 220,
};

const getPosition = getRelativePosition(boundingRect);

test('getRelativePosition should return { cursor: nw-resize, positions: [top, left] } if (x, y) in top left', () => {
  const x = 22;
  const y = 12;
  const actual = getPosition(x, y);
  const expected = {
    cursor: 'nw-resize',
    positions: ['top', 'left'],
  };

  assert.deepEqual(actual, expected);
});

test('getRelativePosition should return { cursor: ns-resize, positions: [top] } if (x, y) is only on top', () => {
  const x = 10;
  const y = 12;
  const actual = getPosition(x, y);
  const expected = {
    cursor: 'ns-resize',
    positions: ['top'],
  };

  assert.deepEqual(actual, expected);
});

test('getRelativePosition should return { cursor: ns-resize, positions: [bottom] } if (x, y) on bottom', () => {
  const x = 0;
  const y = 161;
  const actual = getPosition(x, y);
  const expected = {
    cursor: 'ns-resize',
    positions: ['bottom'],
  };

  assert.deepEqual(actual, expected);
});

test('getRelativePosition should return { cursor: ew-resize, positions: [left] } if (x, y) on left', () => {
  const x = 19;
  const y = 164;
  const actual = getPosition(x, y);
  const expected = {
    cursor: 'ew-resize',
    positions: ['left'],
  };

  assert.deepEqual(actual, expected);
});

test('getRelativePosition should return { cursor: ew-resize, positions: [right] } if (x, y) on right', () => {
  const x = 221;
  const y = 80;
  const actual = getPosition(x, y);
  const expected = {
    cursor: 'ew-resize',
    positions: ['right'],
  };

  assert.deepEqual(actual, expected);
})

test('getRelativePosition should return { cursor: ne-resize, positions: [top, right] } if (x, y) on top right', () => {
  const x = 219;
  const y = 12;
  const actual = getPosition(x, y);
  const expected = {
    cursor: 'ne-resize',
    positions: ['top', 'right'],
  };

  assert.deepEqual(actual, expected);
})

test('getRelativePosition should return { cursor: se-resize, positions: [bottom, right] } if (x, y) on bottom right', () => {
  const x = 220;
  const y = 158;
  const actual = getPosition(x, y);
  const expected = {
    cursor: 'se-resize',
    positions: ['bottom', 'right'],
  };

  assert.deepEqual(actual, expected);
});

test('getRelativePosition should return { cursor: sw-resize, positions: [bottom, left] } if (x, y) on bottom left', () => {
  const x = 18;
  const y = 158;
  const actual = getPosition(x, y);
  const expected = {
    cursor: 'sw-resize',
    positions: ['bottom', 'left'],
  };

  assert.deepEqual(actual, expected);
});

test('getRelativePosition should return { cursor: default, positions: [] } if (x, y) out of bounds', () => {
  const x = 0;
  const y = 0;
  const actual = getPosition(x, y);
  const expected = {
    cursor: 'default',
    positions: [],
  };

  assert.deepEqual(actual, expected);
});

test('getRelativePosition should return { cursor: default, positions: [] } if (x, y) in bounds, but not in tolerance of a side', () => {
  const x = 80;
  const y = 40;
  const actual = getPosition(x, y);
  const expected = {
    cursor: 'default',
    positions: [],
  };

  assert.deepEqual(actual, expected);
});
