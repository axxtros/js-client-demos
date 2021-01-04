/**
 * 10/01/2020
 * axtros (axtros@gmail.com)  
 * 
 * WebGL common and utility module.
 * (This module use the Module pattern. Tutorial and examples: https://www.oreilly.com/library/view/learning-javascript-design/9781449334840/ch09s03.html)
 */

"use strict";

//global variables
var gl;

/**
 * WebGL environment common functions.
 */
var WEBGL = (function () {

  var canvas;

  //private variables and functions    
  const SahderType = {
    "VERTEX_SHADER": 1, 
    "FRAGMENT_SHADER": 2
  }
  
  function compileShader(shaderSource, shaderType) {
    let shader = gl.createShader(shaderType === SahderType.VERTEX_SHADER ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log("Error compiling shader: " + gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  //public variables and functions    
  return {

    //variables
    shaderType: SahderType,

    //functions
    initWebGLContext: function(canvasName) {
      canvas = document.getElementById(canvasName);
      gl = canvas.getContext('webgl');
      if(!gl) {
        console.log('Failed to get the rendering context for WebGL!');
        return;
      }      
    },

    clearCanvasBlack: function() {
      gl.clearColor(0.0, 0.0, 0.0, 1.0);          //Not optimal, that always set color, when call the screen cleaner! Move this line in the context init function. !!!
      gl.clear(gl.COLOR_BUFFER_BIT);
    },

    //Shader init come from Beginning WebGL for HTML5 book.
    initShaders: function(vertexShaderSource, fragmentShaderSource) {      
      let compiledVertexShader = compileShader(vertexShaderSource, SahderType.VERTEX_SHADER);
      let compiledFragmentShader = compileShader(fragmentShaderSource, SahderType.FRAGMENT_SHADER);
      let program = gl.createProgram();
      gl.attachShader(program, compiledVertexShader);
      gl.attachShader(program, compiledFragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log("Unable to initialize the shader program!");
      }					
      gl.useProgram(program);      
    },

    /**
     * Return the current WebGL program.
     */
    getCurrentGLSLProgram: function() {
      return gl.getParameter(gl.CURRENT_PROGRAM);
    },

    getWebGLCanvas: function() {
      return canvas;
    }

  };

}()); //WEBGL -----------------------------------------------------------------

var vector2D = (function() {

  return {

  };
}()); //vector2D --------------------------------------------------------------

var vector3D = (function() {

  return {

  };
}()); //vector3D --------------------------------------------------------------

var matrix4 = (function() {

  return {

  };
}()); //matrix4 ---------------------------------------------------------------

var commonMath = (function() {

  const EPSILON = 0.000001;       //tolerance number
  const DEGREE = Math.PI / 180;
  const ANGLE = 180 / Math.PI;

  return {

    getRadian: function(angle) {
      return DEGREE * angle;
    },

    getAngle: function(radian) {
      return ANGLE * radian;
    },

    /**
     * Compares two numbers within the tolerance limits.
     */
    isEquals: function(value1, value2) {
      return Math.abs(value1 - value2) <= EPSILON * Math.max(Math.abs(value1), Math.abs(value2), 1.0);
    }

  };
}()); //commonMath ------------------------------------------------------------