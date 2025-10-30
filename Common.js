'use strict';

window.onerror = onError;
window.onresize = onResize;

//=================================================
function assert(condition, message) {
  if (!condition) {
    alert(message || "Assertion failed");
    throw new Error(message || "Assertion failed");
  }
}

//=================================================
function onError(text) {
    alert(text);
}

//=================================================
function onResize()
{
}

//=================================================
var createWebGL = function (canGL) {
	let gl = null;
    try {
		//support: GLSL ES 1.0 and GLSL ES 3.0 period
		//gl = canGL.getContext('webgl2', { alpha: true, antialias: true });
		//if(!gl) //GLSL ES 1.0
		gl = canGL.getContext('webgl', { alpha: true, antialias: true });
		if(!gl)
			gl = canGL.getContext('experimental-webgl');
    } catch (e) {
        gl = null;
    }

    if (!gl || !gl.getExtension('OES_texture_float') || !gl.getExtension('OES_texture_float_linear')) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
        gl = null;
    }
	
	if(gl)
	{
		const ext = gl.getExtension('ANGLE_instanced_arrays');
		if (!ext)
			alert('need ANGLE_instanced_arrays');
	}
		
    return gl;
};

//=================================================
// Compiles a shader from a source string
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

//=================================================
// Initializes a shader program with the given shaders
function initShaderProgram(gl, vsSource, fsSource)
{
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
        return null;
    }
    return shaderProgram;
}

//=================================================
function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}

//=================================================
function Draw2D(canvas) {
	const ctx = canvas.getContext('2d');
	if(!ctx)
	{
		alert("error");
		return;
	}
    const backgroundImage = new Image();
    backgroundImage.src = './image/01.jpg';
	// The key step: Wait for the image to load before drawing it
    backgroundImage.onload = () => {
      // Clear the canvas to ensure a clean slate
      //ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the image at position (0, 0)
      // The image will be stretched to fill the entire canvas
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

      // --- You can now draw other content on top of the background ---
      ctx.fillStyle = 'rgba(255, 0, 255, 0.7)'; // Semi-transparent white
      ctx.fillRect(50, 50, 200, 100);
      ctx.fillStyle = 'black';
      ctx.font = '24px Arial';
      ctx.fillText('Hello Canvas!', 60, 100);
    };
}

//=================================================
function loadTexture(gl, url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Fill the texture with a solid color until the image loads
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);

    const image = new Image();
    image.crossOrigin = 'anonymous'; // Important for CORS security
    image.src = url;

    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // Flip the image to match WebGL's coordinates
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

        // WebGL1 requires power-of-2 dimensions for mipmaps
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
        //Render();
    };
    
    return texture;
}
