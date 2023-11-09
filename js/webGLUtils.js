function compileShader(gl, script, type) {
  const output = gl.createShader(type);
  gl.shaderSource(output, script);
  gl.compileShader(output);

  if(!gl.getShaderParameter(output, gl.COMPILE_STATUS)) {
    console.log("Shader error: \n" + gl.getShaderInfoLog(output));
  }
  return output;
}

function createProgram(gl, vs, fs) {
  if (!vs || !fs) {
    throw 'Shaders not defined';
  }
  const vShader = compileShader(gl, vs, gl.VERTEX_SHADER);
  const fShader = compileShader(gl, fs, gl.FRAGMENT_SHADER);
  const program = gl.createProgram();
  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    throw `Could not compile WebGL program. \n\n${info}`;
  }

  return program;
}


function bindArrBuff(gl, arr) {
  const vertBuff = gl.createBuffer();
  if (!vertBuff) {
    console.error("Failed to create buffer");
    return null;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertBuff);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);
}


function withProgram(gl, progMeta, cb) {
  gl.useProgram(progMeta.program);
  cb();
  gl.useProgram(null);
}
