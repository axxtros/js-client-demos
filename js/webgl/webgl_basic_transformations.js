//moving, rotation, scaling

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
  WEBGL.initShaders(VSHADER_SOURCE_4, FSHADER_SOURCE_4);
  
  glProgram = WEBGL.getCurrentGLSLProgram();
  var vericleNumber = initVertexBuffer();
  
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