import vertexShaderSource from './shader.vert';
import fragmentShaderSource from './shader.frag';

const canvas = document.querySelector('.canvas-container');
const gl = canvas.getContext('webgl');

// 定数の定義
const CLEAR_COLOR = [0.0, 0.0, 0.0, 1.0]; // 背景色（黒）
const NUM_COMPONENTS_POSITION = 2; // 位置データのコンポーネント数 (x, y)
const NUM_COMPONENTS_COLOR = 3; // 色データのコンポーネント数 (r, g, b)
const NUM_COMPONENTS_SIZE = 1; // サイズデータのコンポーネント数 (1つの値)
const FLOAT_SIZE = Float32Array.BYTES_PER_ELEMENT; // 1つのFLOATのバイト数
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

const numVertices = 600000; // 描画する頂点数を変更できる
const positionData = [];
const colorData = [];
const sizeData = [];

// 頂点ごとに位置、色、サイズを生成
const radius = 0.3; // 円の半径
const tubeRadius = 0.3; // トーラスの内部の太さ
for (let i = 0; i < numVertices; i++) {
  const angle = (i / numVertices) * Math.PI * 2;

  // トーラスの外側円
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  // 内部円（円周上の各頂点に追加の変位を持たせる）
  const tubeAngle = (i / numVertices) * Math.PI * 2; // ここでねじりを加える
  const tx = Math.cos(tubeAngle) * tubeRadius; // 内部円のx座標
  const ty = Math.sin(tubeAngle) * tubeRadius; // 内部円のy座標

  positionData.push(x + tx, y + ty); // 位置データの追加

  // 色をランダムに生成
  const r = Math.random();
  const g = Math.random();
  const b = Math.random();
  colorData.push(r, g, b); // 色データの追加

  // サイズをランダムに設定
  const size = Math.random() * 200 + 1; // サイズをランダムに設定
  sizeData.push(size);
}

// Float32Arrayに変換してWebGLに渡す準備
const positionFloat32Array = new Float32Array(positionData);
const colorFloat32Array = new Float32Array(colorData);
const sizeFloat32Array = new Float32Array(sizeData);

// 位置バッファの作成とデータ設定
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positionFloat32Array, gl.STATIC_DRAW);

// 頂点属性の設定 (位置)
const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
gl.vertexAttribPointer(
  positionAttributeLocation,
  NUM_COMPONENTS_POSITION,
  gl.FLOAT,
  false,
  NUM_COMPONENTS_POSITION * FLOAT_SIZE,
  0
);
gl.enableVertexAttribArray(positionAttributeLocation);

// 色バッファの作成とデータ設定
const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, colorFloat32Array, gl.STATIC_DRAW);

// 色の属性の設定
const colorAttributeLocation = gl.getAttribLocation(program, 'a_color');
gl.vertexAttribPointer(
  colorAttributeLocation,
  NUM_COMPONENTS_COLOR,
  gl.FLOAT,
  false,
  NUM_COMPONENTS_COLOR * FLOAT_SIZE,
  0
);
gl.enableVertexAttribArray(colorAttributeLocation);

// サイズバッファの作成とデータ設定
const sizeBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
gl.bufferData(gl.ARRAY_BUFFER, sizeFloat32Array, gl.STATIC_DRAW);

// サイズの属性の設定
const sizeAttributeLocation = gl.getAttribLocation(program, 'a_size');
gl.vertexAttribPointer(
  sizeAttributeLocation,
  NUM_COMPONENTS_SIZE,
  gl.FLOAT,
  false,
  NUM_COMPONENTS_SIZE * FLOAT_SIZE,
  0
);
gl.enableVertexAttribArray(sizeAttributeLocation);

// 画面をクリアしてポイントを描画
gl.clearColor(...CLEAR_COLOR); // 背景を設定した色でクリア
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.POINTS, 0, numVertices); // ループで生成した頂点数に合わせて描画
