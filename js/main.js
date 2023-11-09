const PALLETE = {
  background: [0.98, 0.56, 0.55, 1],
  black: [0.09, 0.28, 0.47, 1],
  yellow: [0.96, 0.86, 0.4, 1]
}

function loop() {
  window.game.update();
  requestAnimationFrame(loop);
}

function createCanvas(tagName = "canvas", w = 500, h = 400) {
  const canvasElem = document.createElement(tagName);
  canvasElem.width = w;
  canvasElem.height = h;

  document.body.appendChild(canvasElem);
  return canvasElem;
}
function createGl(canvas) {
  const gl = canvas.getContext("webgl2");
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  gl.clearColor(...PALLETE.background);
  return gl;
}

class Game {
  time = 0;
  constructor() {
    this.canvasElm = createCanvas();
    this.gl = createGl(this.canvasElm);

    this.light = new Light(this.gl);
    this.canvasElm.addEventListener("click", () => {
      this.light.showLight();
      this.hatGroup.worry();
      this.time = - (LIGHT_DURATION + HAT_SHOCK_DELAY) * TIME_STEP;
    });
    this.hatGroup = new HatGroup(this.gl);
    this.hatGroup.addHat([
      200, 350,
      200, 300,
      200, 200,
      200, 0,
    ]);
    this.hatGroup.addHat([
      300, 300,
      300, 250,
      300, 200,
      300, 0,
    ]);
    this.hatGroup.addHat([
      100, 250,
      100, 200,
      100, 100,
      100, 0,
    ]);
    this.hatGroup.addHat([
      400, 250,
      400, 200,
      400, 100,
      400, 0,
    ]);
    this.update();
    console.log(this.gl.getParameter(this.gl.COLOR_CLEAR_VALUE));
  }

  update() {
    this.gl.viewport(0,0, this.canvasElm.width, this.canvasElm.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    this.hatGroup.render(this.time);
    this.light.render(this.time);
    this.gl.flush();
    this.time = this.time + TIME_STEP;
  }
}
