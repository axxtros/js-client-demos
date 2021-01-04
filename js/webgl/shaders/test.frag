
#ifdef GL_ES
precision mediump float;
#endif

#define PI				3.141592653589793

void main() {
  vec3 color = vec3(1.0, 0.54, 0.34);
  gl_FragColor = vec4(color, 1.0);  
}					