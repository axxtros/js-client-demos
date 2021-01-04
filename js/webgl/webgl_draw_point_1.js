"use strict";

  var glProgram = null;
  var vertexShader = null;
  var fragmentShader = null;

function main() {
  WEBGL.initWebGLContext("webgl_canvas");
  WEBGL.clearCanvasBlack();
  WEBGL.initShaders(VSHADER_SOURCE_DRAW_POINT_VER_1, FSHADER_SOURCE_DRAW_POINT_VER_1);

  WEBGL.shaderType.FRAGMENT_SHADER;  


  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.drawArrays(gl.POINTS, 0, 1);
}

