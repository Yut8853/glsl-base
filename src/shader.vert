attribute vec2 a_position;  // 位置データ
attribute vec3 a_color;     // 色データ

varying vec3 v_color;

void main() {
  v_color = a_color;
  gl_Position = vec4(a_position, 0.0, 1.0);
}