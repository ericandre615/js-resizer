import { assert, test } from '../../test-utils/test.js';

import {
  createResizeHandler,
  createMouseDownHandler,
  createMouseUpHandler,
} from '../resize-utils.js';

const stopPropagation = () => (true);

const testElement = {
  classNames: [],
  classList: {
    add: className => testElement.classNames.push(className),
    remove: className => {
     let idx =  testElement.classNames.indexOf(className);
      testElement.classNames.splice(idx, 1);
    },
    contains: className => testElement.classNames.includes(className),
  },
  style: {
    width: 200,
    height: 140,
    top: 10,
    left: 20,
    bottom: 150,
    right: 220,
    x: 10,
    y: 20,
  },
  getBoundingClientRect: () => ({
    width: testElement.style.width,
    height: testElement.style.height,
    top: testElement.style.top,
    left: testElement.style.left,
    bottom: testElement.style.bottom,
    right: testElement.style.right,
    x: testElement.style.x,
    y: testElement.style.y,
  }),
};

const mouseUpHandler = createMouseUpHandler([testElement]);
const mouseDownHandler = createMouseDownHandler([testElement]);
const resizeHandler = createResizeHandler([testElement]);

const createEvent = (x, y, target) => ({
  clientX: x,
  clientY: y,
  target,
  stopPropagation,
});

const resetResizeState = () => mouseUpHandler(createEvent(0, 0, testElement));

test('resizeHandler:  mouseDownHandler should set classname if target is registered', () => {
  const testEvent = createEvent(0, 0, testElement);
  const expected = ['js-resizing'];

  assert.deepEqual(testElement.classNames, []);

  mouseDownHandler(testEvent);

  assert.deepEqual(testElement.classNames, expected);
});

test('resizeHandler:  mouseUpHandler should remove classname if target is registered', () => {
  const testEvent = createEvent(0, 0, testElement);
  const expected = [];

  resetResizeState();

  assert.deepEqual(testElement.classNames, []);

  mouseDownHandler(testEvent);
  mouseUpHandler(testEvent);

  assert.deepEqual(testElement.classNames, expected);
});

// TODO: need a way to supply mock document and window with my test runner
//test('resizeHandler: should set element transform if element is selectable', () => {
//  const testEvent = createEvent(0, 0, testElement);
//  const expected = 'matrix';
//  resetResizeState();
//
//  mouseDownHandler(testEvent);
//  resizeHandler(testEvent);
//
//  assert.deepEqual(testElement.style.transform, expected);
//});
