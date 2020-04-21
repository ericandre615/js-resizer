const defaultTolerance = 2;

export const createTolerance = (base = 0, tolerance = defaultTolerance) => {
  const arr = [];

  for (let i = tolerance; i >= 0; i--) {
    arr.push(base - i);
  }
  for (let i = 1; i < tolerance + 1; i++) {
    arr.push(base + i);
  }

  return arr;
};

export const withinTolerance = (left, right) => createTolerance(right)
  .some(tolerance => (
    left == tolerance
  ));

export const withinBounds = (boundingRect, tolerance = defaultTolerance) => (x, y) => {
  const {
    top,
    left,
    right,
    bottom,
  } = boundingRect;

  return (
    x >= left - tolerance &&
    x <= right + tolerance &&
    y >= top - tolerance &&
    y <= bottom + tolerance
  );
}

export const getRelativePosition = boundingRect => (x, y) => {
  const {
    top,
    left,
    right,
    bottom,
  } = boundingRect;

  if (withinTolerance(x, left) && withinTolerance(y, top)) {
    return { cursor: 'nw-resize', positions: ['top', 'left'] };
  }
  if (withinTolerance(x, right) && withinTolerance(y, bottom)) {
    return { cursor: 'se-resize', positions: ['bottom', 'right'] };
  }
  if (withinTolerance(x, right) && withinTolerance(y, top)) {
    return { cursor: 'ne-resize', positions: ['top', 'right'] };
  }
  if (withinTolerance(x, left) && withinTolerance(y, bottom)) {
    return { cursor: 'sw-resize', positions: ['bottom', 'left'] };
  }
  if (withinTolerance(x, left)) {
    return { cursor: 'ew-resize', positions: ['left'] };
  }
  if (withinTolerance(x, right)) {
    return { cursor: 'ew-resize', positions: ['right'] };
  }
  if (withinTolerance(y, top)) {
    return { cursor: 'ns-resize', positions: ['top'] };
  }
  if (withinTolerance(y, bottom)) {
    return { cursor: 'ns-resize', positions: ['bottom'] };
  }

  return { cursor: 'default', positions: [] };
};

export const anyRegisteredElementInBounds = elements => (x, y) => elements.some(elem => {
  return withinBounds(elem.getBoundingClientRect())(x, y);
});

const RESIZING = 'js-resizing';
const state = {
  selectedElement: undefined,
  selectedCursor: undefined,
  startX: undefined,
  startY: undefined,
  startWidth: undefined,
  startElementX: undefined,
  startHeight: undefined,
  startElementY: undefined,
};

export const createCursorHandler = (registeredElements) => e => {
  e.preventDefault();
  const { clientX: x, clientY: y, button } = e;
  const { selectedElement } = state;

  registeredElements.forEach(element => {
    const boundingRect = element.getBoundingClientRect();
    const {
      x: offsetX,
      y: offsetY,
      width,
      height,
      top,
      left,
      bottom,
      right,
    } = boundingRect;

    const { cursor, positions } = getRelativePosition(boundingRect)(x, y);
    const isInBounds = withinBounds(boundingRect)(x, y);


    if(!anyRegisteredElementInBounds(registeredElements)(x, y) && !selectedElement) {
      document.body.style.cursor = 'default';
      return false;
    }

    if (isInBounds && !selectedElement) {
      document.body.style.cursor = cursor;
    }
  });
};

const isSelectedResizable = selected => (
  selected && selected.classList.contains(RESIZING)
);

const getStyles = element => {
  window.getComputedStyle(element);
}

const NO_TRANSFORM = 'none';
const matrixRegex = /\(([^)]+)\)/;
export const getTransformMatrix = element => {
  //matrix(1, 0, 0, 1, x, y)
  //matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1)
  const { transform } = window.getComputedStyle(element);
  const is3D = transform.includes('matrix3d');

    if(transform == NO_TRANSFORM) {
    return { x: 0, y: 0, z: 0 };
  }

  const matrix = (matrixRegex.exec(transform)[1] || '').split(',')
    .map(n => parseInt(n, 10));
  const len = matrix.length;

  if (is3D) {
    return {
      x: matrix[len - 4],
      y: matrix[len - 3],
      z: matrix[len - 2],
    };
  }

  return {
    x: matrix[len - 2],
    y: matrix[len - 1],
    z: 0,
  };
};

export const createResizeHandler = registeredElements => e => {
    const { target, clientX: x, clientY: y } = e;
    const {
      selectedElement,
      selectedCursor,
      startX,
      startY,
      startWidth,
      startElementX,
      startHeight,
      startElementY,
    } = state;

    if (isSelectedResizable(selectedElement)) {
      const boundingRect = selectedElement.getBoundingClientRect();
      const { cursor, positions } = selectedCursor;
      const {
        x: offsetX,
        y: offsetY,
        width,
        height,
        top,
        left,
        bottom,
        right,
      } = boundingRect;
      const matrix = getTransformMatrix(selectedElement);

      document.body.style.cursor = cursor;

      if (positions.includes('right')) {
        selectedElement.style.width = x - left + 'px';
      }

      if (positions.includes('bottom')) {
        selectedElement.style.height = y - top + 'px';
      }

      // special case
      if (positions.includes('top') && positions.includes('left')) {
        selectedElement.style.width = startWidth - (x - startX) + 'px';
        selectedElement.style.height = startHeight - (y - startY) + 'px';

        const translateX = startElementX + (x - startX) + 'px';
        const translateY = startElementY + (y - startY) + 'px';
        selectedElement.style.transform = `translate3d(${translateX}, ${translateY}, ${matrix.z})`;

        return;
      }

      if (positions.includes('left')) {
        selectedElement.style.width = startWidth - (x - startX) + 'px';
        const translateX = startElementX + (x - startX) + 'px';
        const translateY = (matrix.y || startElementY) + 'px';
        selectedElement.style.transform = `translate3d(${translateX}, ${translateY}, ${matrix.z})`;
      }

      if (positions.includes('top')) {
        selectedElement.style.height = startHeight - (y - startY) + 'px';
        const translateX = (matrix.x || startElementX) +'px';
        const translateY = startElementY + (y - startY) + 'px';
        selectedElement.style.transform = `translate3d(${translateX}, ${translateY}, ${matrix.z})`;
      }
    }
};

export const createMouseDownHandler = registeredElements => e => {
  e.stopPropagation();
  const { clientX: x, clientY: y, target } = e;
  const registeredElement = registeredElements.find(el => el == target);

  if (registeredElement) {
    const boundingRect = registeredElement.getBoundingClientRect();
    registeredElement.classList.add(RESIZING);
    state.selectedElement = registeredElement;
    state.selectedCursor = getRelativePosition(boundingRect)(x, y);
    state.startX = x;
    state.startY = y;
    state.startWidth = boundingRect.width;
    state.startElementX = boundingRect.left;
    state.startHeight = boundingRect.height;
    state.startElementY = boundingRect.top;
  }
};

export const createMouseUpHandler = registeredElements => e => {
  e.stopPropagation();
  const { target } = e;
  const registeredElement = registeredElements.find(el => el == target);

  registeredElements.forEach(el => el.classList.remove(RESIZING));

  state.selectedElement = undefined;
  state.selectedCursor = undefined;
  state.startX = undefined;
  state.startY = undefined;
  state.startWidth = undefined;
  state.startElementX = undefined;
  state.startHeight = undefined;
  state.startElementY = undefined;
};

export default {
  createResizeHandler,
  createCursorHandler,
  createMouseDownHandler,
  createMouseUpHandler,
};

