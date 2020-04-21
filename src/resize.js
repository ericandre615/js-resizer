import {
  createResizeHandler,
  createCursorHandler,
  createMouseDownHandler,
  createMouseUpHandler,
} from './resize-utils.js';

const RESIZABLE = 'js-resizable';
const registeredElements = [];
let isActive = false;
let resizeHandler;
let cursorHandler;
let mouseDownHandler;
let mouseUpHandler;

export const attachResize = (app = document) => element => {
  registeredElements.push(element);
  element.classList.add(RESIZABLE);

  if (!resizeHandler) {
    resizeHandler = createResizeHandler(registeredElements);
    cursorHandler = createCursorHandler(registeredElements);
    mouseDownHandler = createMouseDownHandler(registeredElements);
    mouseUpHandler = createMouseUpHandler(registeredElements);
  }

  const detachHandlers = () => {
    const elementIndex = registeredElements.indexOf(element);
    registeredElements.splice(elementIndex, 1);

    registeredElements[elementIndex].classList.remove(RESIZABLE);

    if (!registeredElements.length) {
      app.removeEventListener('mousemove', resizeHandler, false);
      app.removeEventListener('mousemove', cursorHandler, false);
      app.removeEventListener('mousedown', mouseDownHandler, false);
      app.removeEventListener('mouseup', mouseUpHandler, false);

      isActive = false;
    }
  };

  if (isActive == false) {
    app.addEventListener('mousemove', resizeHandler, false);
    app.addEventListener('mousemove', cursorHandler, false);
    app.addEventListener('mousedown', mouseDownHandler, false);
    app.addEventListener('mouseup', mouseUpHandler, false);

    isActive = true;
  }

  return detachHandlers;
}

export default attachResize;
