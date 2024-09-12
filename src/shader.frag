precision mediump float;

varying vec3 v_color; // 頂点シェーダーから渡された色を受け取る

void main() {
  gl_FragColor = vec4(v_color, 1.0); // 色を出力
}
