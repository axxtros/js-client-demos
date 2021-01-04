"use strict";

var canvas;
var glProgram = null;
var vertexShader = null;
var fragmentShader = null;

var a_position;
var a_size;
var u_color;

var Point = {
  x: 0,
  y: 0
}

var pointArray = new Array();

function main() {  
  WEBGL.initWebGLContext("webgl_canvas");  
  WEBGL.initShaders(VSHADER_SOURCE_DRAW_POINT_VER_2, FSHADER_SOURCE_DRAW_POINT_VER_2);
  WEBGL.getWebGLCanvas().addEventListener("click", onMouseClick, false);
  canvas = WEBGL.getWebGLCanvas();

  let glProgram = WEBGL.getCurrentGLSLProgram();
  a_position = gl.getAttribLocation(glProgram, 'a_position');    
  a_size = gl.getAttribLocation(glProgram, 'a_size');
  u_color = gl.getUniformLocation(glProgram, 'u_color');
  
  gl.vertexAttrib3f(a_position, 0.0, 0.0, 0.0);
  gl.vertexAttrib1f(a_size, 5.0);

  WEBGL.clearCanvasBlack();
  gl.drawArrays(gl.POINTS, 0, 1);  
}

function onMouseClick(ev) {  
  let rect = canvas.getBoundingClientRect();
  let x = ev.clientX;
  let y = ev.clientY;

  x = ((x - rect.left) - (canvas.height / 2)) / (canvas.height / 2);
  y = (canvas.width / 2 - (y - rect.top)) / (canvas.width / 2);
  console.log('x: ' + x + ' y: ' + y);
  
  let point = Object.create(Point);
  point.x = x;
  point.y = y;
  pointArray.push(point);

  drawPoint();
}

function drawPoint() {
  WEBGL.clearCanvasBlack();
  for(let i = 0; i != pointArray.length; i++) {

    if(pointArray[i].y > 0.5) {
      gl.uniform4f(u_color, 1.0, 0.0, 0.0, 1.0);  
    } else if(pointArray[i].y <= 0.5 && pointArray[i].y >= -0.5) {
      gl.uniform4f(u_color, 0.0, 1.0, 0.0, 1.0);
    } else {
      gl.uniform4f(u_color, 0.0, 0.0, 1.0, 1.0);
    }  

    gl.vertexAttrib3f(a_position, pointArray[i].x, pointArray[i].y, 0.0);    
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}