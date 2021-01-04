//Ebben az állományban csak a shaderek vannak tárolva, hogy a demok és tesztek esetében gyorsabban elérhetőek.
//A végső megoldásban noSQL adatbázisban lesznek eltárolva, és szerver oldalról lesznek átadva az egyes klienseknek.

// draw points ----------------------------------------------------------------
var VSHADER_SOURCE_DRAW_POINT_VER_1 =
  'void main() {\n' +
  ' gl_Position = vec4(0.0, 0.0, 0.0, 1.0);\n' +
  ' gl_PointSize = 10.0;\n' +
  '}\n';

 var FSHADER_SOURCE_DRAW_POINT_VER_1 =
  'void main() {\n' +
  ' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' + // Set the color
  '}\n';

// draw points ----------------------------------------------------------------
var VSHADER_SOURCE_DRAW_POINT_VER_2 =
  'attribute vec4 a_position; \n' +
  'attribute float a_size; \n' +
  'void main() {\n' +
  ' gl_Position = a_position;\n' +
  ' gl_PointSize = a_size;\n' +
  '}\n';

 var FSHADER_SOURCE_DRAW_POINT_VER_2 =
  'precision mediump float;\n' +
  'uniform vec4 u_color;\n' +
  'void main() {\n' +
  ' gl_FragColor = u_color;\n' + // Set the color
  '}\n';

// triangle -------------------------------------------------------------------
 var VSHADER_SOURCE_3 =
  'attribute vec4 a_position;\n' +
  'void main() {\n' +
  ' gl_Position = a_position;\n' +
  ' gl_PointSize = 5.0;\n' +
  '}\n';

 var FSHADER_SOURCE_3 =
  'void main() {\n' +
  ' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' + // Set the color
  '}\n';

// basic_transformation -------------------------------------------------------
 var BASIC_TRANSFORMATION_VSHADER_SOURCE =
  'attribute vec4 a_position;\n' +
  'uniform vec4 u_translation;\n' +
  'uniform float u_sin;\n' +
  'uniform float u_cos;\n' +
  'void main() {\n' +
  ' gl_Position.x = u_translation.x + (a_position.x * u_cos - a_position.y * u_sin);\n' +
  ' gl_Position.y = u_translation.y + (a_position.x * u_sin + a_position.y * u_cos);\n' +
  ' gl_Position.z = u_translation.z + a_position.z;\n' +
  ' gl_Position.w = a_position.w;\n' +
  ' //gl_Position = a_position + u_translation;\n' +
  ' gl_PointSize = 5.0;\n' +
  '}\n';

 var BASIC_TRANSFORMATION_FSHADER_SOURCE =
  'void main() {\n' +
  ' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' + // Set the color
  '}\n';