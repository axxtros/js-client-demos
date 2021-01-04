"use strict";

var glProgram = null;
var vertexShader = null;
var fragmentShader = null;

var Point = {
  x: 0,
  y: 0
}

function main() {  
  WEBGL.initWebGLContext("webgl_canvas");
  WEBGL.initShaders(BASIC_TRANSFORMATION_VSHADER_SOURCE, BASIC_TRANSFORMATION_FSHADER_SOURCE);
  
  glProgram = WEBGL.getCurrentGLSLProgram();
  var vericleNumber = initVertexBuffer();
  
  //move
  let u_translation = gl.getUniformLocation(glProgram, 'u_translation');
  gl.uniform4f(u_translation, 0.2, 0.4, 0.0, 0.0);

  //rotate
  let angle = 45;  
  let radian = glMath.getRadian(angle);  

  let u_sin = gl.getUniformLocation(glProgram, 'u_sin');
  let u_cos = gl.getUniformLocation(glProgram, 'u_cos');  
  gl.uniform1f(u_sin, Math.sin(radian));
  gl.uniform1f(u_cos, Math.cos(radian));
  
  WEBGL.clearCanvasBlack();
  gl.drawArrays(gl.TRIANGLES, 0, vericleNumber);
}

function initVertexBuffer() {
  //float typed array: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays
  let verticleElementNumber = 4;
  let verticles = new Float32Array([
    0.0, 0.5, 0.0, 1.0,
    -0.5, -0.5, 0.0, 1.0,
    0.5, -0.5, 0.0, 1.0
  ]);

  let vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticles, gl.STATIC_DRAW);
  let a_position = gl.getAttribLocation(glProgram, 'a_position');
  gl.vertexAttribPointer(a_position, verticleElementNumber, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_position);
  return verticles.length / verticleElementNumber;
}