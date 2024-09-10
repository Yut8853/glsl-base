import vertexShaderSource from './shader.vert';
import fragmentShaderSource from './shader.frag';

const canvas = document.querySelector('.canvas-container');
const gl = canvas.getContext('webgl');

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
const positions = new Float32Array([
  0.0,
  1.0, // 上の頂点
  -1.0,
  -1.0, // 左下の頂点
  1.0,
  -1.0, // 右下の頂点
]);

// バッファの作成
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

// 頂点属性の設定
const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

// 画面をクリアして三角形を描画
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES, 0, 3);
