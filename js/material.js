const LIGHT_DURATION = 20;
const TIME_STEP = 0.02;
const HAT_SHOCK_DELAY = 10;

class AbstractObject {
  constructor(gl) {
    this.gl = gl;
  }

  _getCommonLocs = (program) => {
    return {
      coord: this.gl.getAttribLocation(program, "coordinates"),
      res: this.gl.getUniformLocation(program, "u_resolution"),
      time: this.gl.getUniformLocation(program, "u_time"),
      worry: this.gl.getUniformLocation(program, "u_worry"),
    }
  }

  _setupCoordsAttrib = (dots, progMeta) => {
    bindArrBuff(this.gl, dots);
    this.gl.vertexAttribPointer(progMeta.locs.coord, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(progMeta.locs.coord);
  }

  _setupResolution = (progMeta) => {
    this.gl.uniform2f(progMeta.locs.res, this.gl.canvas.width, this.gl.canvas.height);
  }
}

class HatGroup extends AbstractObject {
  bodyMeta = {};
  eyeMeta = {};
  hats = [];
  worryTime = 0;

  constructor(gl) {
    super(gl);
    this.init();
  }

  init() {
    this.bodyMeta.program = createProgram(this.gl, hat_vs, hat_fs);
    this.eyeMeta.program = createProgram(this.gl, eye_vs, eye_fs);
    this.bodyMeta.locs = {
      ...this._getCommonLocs(this.bodyMeta.program),
      color: this.gl.getUniformLocation(this.bodyMeta.program, "u_color"),
      size: this.gl.getUniformLocation(this.bodyMeta.program, "u_size"),
    };
    this.eyeMeta.locs = {
      ...this._getCommonLocs(this.eyeMeta.program),
      worryTime: this.gl.getUniformLocation(this.eyeMeta.program, "u_worry_time"),
    };
  }

  addHat(dots) {
    this.hats.push(dots);
  }

  worry() {
    this.worryTime = LIGHT_DURATION + HAT_SHOCK_DELAY;
  }
  _calculateBody(dots) {
    const dotsN = 100;
    const bodyDots = getPointsOnBezierCurve(dots, 0, dotsN);
    const eyeCenter = getPointByIndex(bodyDots, dotsN / 5);
    const eyeDots = [VMath.add(eyeCenter, [25, 0]), VMath.add(eyeCenter, [-25, 0])].flat();
    return {bodyDots, eyeDots};
  }

  drawBody = (dots, time, worry) => {
    withProgram(this.gl, this.bodyMeta, () => {
      this._setupCoordsAttrib(dots, this.bodyMeta);
      this._setupResolution(this.bodyMeta);
      this.gl.uniform1f(this.bodyMeta.locs.time, time);
      this.gl.uniform1f(this.bodyMeta.locs.worry, worry);
      this.gl.uniform4f(this.bodyMeta.locs.color, PALLETE.black[0],PALLETE.black[1],PALLETE.black[2], 0.8);
      this.gl.uniform1f(this.bodyMeta.locs.size, 60);

      this.gl.drawArrays(this.gl.POINTS, 0, dots.length / 2);


      this.gl.uniform4f(this.bodyMeta.locs.color, ...PALLETE.black);
      this.gl.uniform1f(this.bodyMeta.locs.size, 59);
      this.gl.drawArrays(this.gl.POINTS, 0, dots.length / 2);

      this.gl.uniform4f(this.bodyMeta.locs.color, 1,1,1,1);
      this.gl.uniform1f(this.bodyMeta.locs.size, 55);
      this.gl.drawArrays(this.gl.POINTS, 0, dots.length / 2);
    });

  }
  drawEyes = (eyeDots, time, worry) => {
    withProgram(this.gl, this.eyeMeta, () => {
      this._setupCoordsAttrib(eyeDots, this.eyeMeta);
      this._setupResolution(this.eyeMeta);
      this.gl.uniform1f(this.eyeMeta.locs.time, time);
      this.gl.uniform1f(this.eyeMeta.locs.worry, worry);
      this.gl.uniform1f(this.eyeMeta.locs.worryTime, this.worryTime / 2);

      this.gl.drawArrays(this.gl.POINTS, 0, eyeDots.length / 2);
    });
  }

  render = (time) => {
    let worry = false;
    if (this.worryTime > 0) {
      worry = true;
      this.worryTime--;
    }

    this.hats.map(dots => {
      const {bodyDots, eyeDots} = this._calculateBody(dots);
      this.drawBody(bodyDots, time, worry);
      this.drawEyes(eyeDots, time, worry);
    });
  }
}


class Light extends AbstractObject {
  lightMeta = {};
  backMeta = {};
  timespan = 0;
  lightDots = [];

  constructor(gl) {
    super(gl);
    this.init();
  }

  init()  {
    this.lightMeta.program = createProgram(this.gl, light_vs, light_fs);
    this.lightMeta.locs = {
      ...this._getCommonLocs(this.lightMeta.program),
    };
    this.backMeta.program = createProgram(this.gl, light_back_vs, light_back_fs);
    this.backMeta.locs = {
      ...this._getCommonLocs(this.backMeta.program),
    };
  }

  showLight() {
    this.timespan = LIGHT_DURATION;
    this.lightDots = [
      this._generateLight(-50),
      this._generateLight(0),
      this._generateLight(50)
    ];
  }

  _generateLight(offset) {
    const genX = () => Math.random() * 30 + 240;
    const firstDot = [genX(0) + offset, 400];
    const makePairDot = (dot) => ([dot[0] + 0.5, dot[1]]);
    const dots = [firstDot, makePairDot(firstDot)];
    let prevY = 400;
    for (let i = 0; i< 10; i++) {
      const y = prevY - 10 - Math.random() * 50;
      const dot = [genX(20) + offset, y];
      dots.push(dot);
      dots.push(makePairDot(dot));
      prevY = y;
    }
    const res = dots.flat();
    res.pop();
    return res;
  }

  drawLight(time) {
    withProgram(this.gl, this.lightMeta, () => {
      this._setupResolution(this.lightMeta);
      this.gl.uniform1f(this.lightMeta.locs.time, time);
      this.lightDots.map(data => {
        this._setupCoordsAttrib(data, this.lightMeta);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, data.length / 2);
      });
    });
  }

  drawBackground(time) {
    withProgram(this.gl, this.backMeta, () => {
      this._setupResolution(this.backMeta);
      this.gl.uniform1f(this.backMeta.locs.time, time);
      this._setupCoordsAttrib([0, 400, 0, 0, 500,  400, 500, 0], this.backMeta);
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP,0, 4);
    });
  }

  render(time) {
    if (this.timespan > 0) {
      this.drawLight(time);
      this.drawBackground(time);
      this.timespan--;
    }
    // this.drawBackground(time);
  }
}
