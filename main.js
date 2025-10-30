"use strict";

let gl = null;
let program = null;

function isAndroid() {
	const userAgent = navigator.userAgent || navigator.vendor || window.opera;
	return /android/i.test(userAgent);
}

// --- Shaders ---
function compileShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	console.error("Shader error:", gl.getShaderInfoLog(shader));
  }
  return shader;
}

let vertices, vertexCount;
let buffer;

function loadShape(shape) {
  if (shape === "Triangle") {
	vertices = new Float32Array([
	  0.0,  0.7,   1.0, 0.0, 0.0,
	 -0.7, -0.7,   0.0, 1.0, 0.0,
	  0.7, -0.7,   0.0, 0.0, 1.0
	]);
	vertexCount = 3;
  } else if (shape === "Square") {
	vertices = new Float32Array([
	  -0.5,  0.5,   1, 0, 0,
	  -0.5, -0.5,   0, 1, 0,
	   0.5,  0.5,   0, 0, 1,

	   0.5,  0.5,   0, 0, 1,
	  -0.5, -0.5,   0, 1, 0,
	   0.5, -0.5,   1, 1, 0
	]);
	vertexCount = 6;
  }

  buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const FSIZE = vertices.BYTES_PER_ELEMENT;
  const aPosition = gl.getAttribLocation(program, "aPosition");
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, FSIZE * 5, 0);
  gl.enableVertexAttribArray(aPosition);

  const aColor = gl.getAttribLocation(program, "aColor");
  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
  gl.enableVertexAttribArray(aColor);
}

let myButtonsArray = [];
function setActiveButton(activeBtn) {
	// Remove 'active' from all, then set the one clicked
	myButtonsArray.forEach(button => {
		button.classList.remove("active");
	});

  activeBtn.classList.add("active");
}

let angle = 0;
let nCount = 0;
function render() {
	angle += 0.01;
	nCount++;
	
    var info = document.getElementById("info");
	if (isAndroid()) {
	    info.innerHTML = "(Android) " + nCount;
	} else {
	    info.innerHTML = nCount;
	}

	const uAngle = gl.getUniformLocation(program, "uAngle");
	gl.uniform1f(uAngle, angle);
	gl.clearColor(0.05, 0.05, 0.1, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
	requestAnimationFrame(render);
}

let currentShape = "Triangle";
function OnBtnClick(e) {
		currentShape = e.currentTarget.textContent;
		loadShape(e.currentTarget.textContent);
		setActiveButton(e.currentTarget);
		console.log(`A button was clicked! Its text is: ${e.currentTarget.textContent}`);
		
}

function main() {
    // === WebGL Setup ===
    const canvas = document.getElementById("myGL");
	if(isAndroid())
	{
		canvas.width = 480;
		canvas.height = 640;
	}

    gl = createWebGL(canvas);
    if (!gl) {
      alert("WebGL not supported");
      throw new Error("WebGL not supported");
    }

	if(!program)
		program = initShaderProgram(gl, vsSource, fsSource);
    gl.useProgram(program);

    // --- Button Controls ---
    const triangleBtn = document.getElementById("triangleBtn");
    const squareBtn = document.getElementById("squareBtn");

	const buttonNodes = document.querySelectorAll('.myButton');
	myButtonsArray = Array.from(buttonNodes);
	//alert(myButtonsArray.length);

	myButtonsArray.forEach(button => {
		button.addEventListener('click', OnBtnClick);
	});

    // --- Initialize & Render ---
    loadShape("Triangle");

    render();
}

window.onload = main;
