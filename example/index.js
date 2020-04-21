import attachResize from '../src/resize.js';

const app = () =>{
  const canvas = document.getElementById('canvas');
  const webgl = canvas.getContext('web-gl');
  const app = document.getElementById('app');

  const boxOne = document.getElementById('one');
  const boxTwo = document.getElementById('two');

  console.log('Start app');

  canvas.style.position = 'absolute';
  canvas.style.top = '40px';
  canvas.style.left = '40px';
  boxOne.style.position = 'absolute';
  boxOne.style.transform = 'translate(80px, 80px)';
  boxTwo.style.position = 'absolute';
  boxTwo.style.transform = 'translate(0px, 480px)';

  const resize = attachResize(document);
  const removeResizeCanvas = resize(canvas);
  const removeBoxTwo = resize(boxTwo);

  const removeOneResize = resize(boxOne);

  //removeOneResize();
  //removeBoxTwo();
  //removeResizeCanvas(); //remove the event listener
}

export default app;
