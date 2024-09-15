attribute vec2 a_position;  // 位置データ
attribute vec3 a_color;     // 色データ
attribute float a_size; // ポイントサイズの頂点属性を追加

varying vec3 v_color;

void main() {
  v_color = a_color;
  gl_Position = vec4(a_position, 0.0, 1.0);
  gl_PointSize = a_size;
}