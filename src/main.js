import vertexShaderSource from './shader.vert';
import fragmentShaderSource from './shader.frag';

const canvas = document.querySelector('.canvas-container');
const gl = canvas.getContext('webgl');

// 定数の定義
const CLEAR_COLOR = [0.0, 0.0, 0.0, 1.0]; // 背景色（黒）
const NUM_COMPONENTS_POSITION = 2; // 位置データのコンポーネント数 (x, y)
const NUM_COMPONENTS_COLOR = 3; // 色データのコンポーネント数 (r, g, b)
const NUM_TOTAL_COMPONENTS = NUM_COMPONENTS_POSITION + NUM_COMPONENTS_COLOR; // 頂点ごとのデータ数
const FLOAT_SIZE = Float32Array.BYTES_PER_ELEMENT; // 1つのFLOATのバイト数
const STRIDE = NUM_TOTAL_COMPONENTS * FLOAT_SIZE; // ストライドの計算
const OFFSET_POSITION = 0; // 位置データの開始オフセット
const OFFSET_COLOR = NUM_COMPONENTS_POSITION * FLOAT_SIZE; // 色データの開始オフセット
const NUM_VERTICES = 3; // 描画する頂点数（3つの頂点で三角形）

// canvasのリサイズ処理
const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // ビューポートの設定
  gl.viewport(0, 0, canvas.width, canvas.height);
};
resizeCanvas();
window.addEventListener('resize', resizeCanvas); // リサイズ時にcanvasを再設定

// シェーダーの作成とコンパイル
const createShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
};

// 頂点シェーダーとフラグメントシェーダーの作成
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(
  gl,
  gl.FRAGMENT_SHADER,
  fragmentShaderSource
);

// シェーダープログラムの作成
const createProgram = (gl, vertexShader, fragmentShader) => {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program); // 作成したプログラムを使用
  return program;
};

const program = createProgram(gl, vertexShader, fragmentShader);

// 頂点データの定義
const vertexData = new Float32Array([
  // 位置 (x, y) と 色 (r, g, b)
  0.0,
  1.0,
  1.0,
  0.0,
  0.0, // 頂点1
  -1.0,
  -1.0,
  0.0,
  1.0,
  0.0, // 頂点2
  1.0,
  -1.0,
  0.0,
  0.0,
  1.0, // 頂点3
]);

// バッファの作成とデータの設定
const vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

// 頂点属性の設定 (位置は最初の2つのFLOATデータから)
const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
gl.vertexAttribPointer(
  positionAttributeLocation,
  NUM_COMPONENTS_POSITION,
  gl.FLOAT,
  false,
  STRIDE,
  OFFSET_POSITION
);
gl.enableVertexAttribArray(positionAttributeLocation);

// 色の属性の設定 (色は位置の後の3つのFLOATデータから)
const colorAttributeLocation = gl.getAttribLocation(program, 'a_color');
gl.vertexAttribPointer(
  colorAttributeLocation,
  NUM_COMPONENTS_COLOR,
  gl.FLOAT,
  false,
  STRIDE,
  OFFSET_COLOR
);
gl.enableVertexAttribArray(colorAttributeLocation);

// 画面をクリアして三角形を描画
gl.clearColor(...CLEAR_COLOR); // 背景を設定した色でクリア
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES, 0, NUM_VERTICES);
