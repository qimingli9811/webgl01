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
function getAllItems(obj) 
{
	let message = '';
	for (let key in obj)
		message += `${key}: ${obj[key]} (type: ${typeof obj[key]}) (${obj[key].BYTES_PER_ELEMENT})\n`;

	return message;
}

//=================================================
function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}

//=================================================
//src = 'moon.jpg'
function TexFromImage(gl, src)
{
	const texture = gl.createTexture();
	const image = new Image();
	image.crossOrigin = "";  // needed if loading from another origin
	//image.src = 'moon.jpg';
	image.src = src;
	image.onload = () => {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // Flip so UVs match
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		if (isPowerOf2(image.width) && isPowerOf2(image.height))
			gl.generateMipmap(gl.TEXTURE_2D);
		else
		{
			// Non-power-of-2: disable mipmaps and clamp wrapping
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		}
	}

	return texture;
}

//=================================================
function generateFace(ctx, faceColor, textColor, text)
{
  const {width, height} = ctx.canvas;  
  ctx.fillStyle = faceColor;
  ctx.fillRect(0, 0, width, height);
  ctx.font = `${width * 0.7}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = textColor;
  ctx.fillText(text, width / 2, height / 2);
}

function Create_6_Textures(gl)
{
	// Get A 2D context @type {Canvas2DRenderingContext}
	const ctx = document.createElement("canvas").getContext("2d");
	ctx.canvas.width = 256;
	ctx.canvas.height = 256;

	const faceInfos = [
	{ target: gl.TEXTURE_2D, faceColor: '#F00', textColor: '#0FF', text: '+X' },
	{ target: gl.TEXTURE_2D, faceColor: '#FF0', textColor: '#00F', text: '-X' },
	{ target: gl.TEXTURE_2D, faceColor: '#0F0', textColor: '#F0F', text: '+Y' },
	{ target: gl.TEXTURE_2D, faceColor: '#0FF', textColor: '#F00', text: '-Y' },
	{ target: gl.TEXTURE_2D, faceColor: '#00F', textColor: '#FF0', text: '+Z' },
	{ target: gl.TEXTURE_2D, faceColor: '#F0F', textColor: '#0F0', text: '-Z' },
	];
	
	let textures = [];
	faceInfos.forEach((Info) => {
		const {target, faceColor, textColor, text} = Info;
		generateFace(ctx, Info.faceColor, Info.textColor, Info.text);
	
		const level = 0;
		const internalFormat = gl.RGBA;
		const format = gl.RGBA;
		const type = gl.UNSIGNED_BYTE;
		const texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(target, level, internalFormat, format, type, ctx.canvas);
		gl.generateMipmap(gl.TEXTURE_2D);
		textures.push(texture);
	});
	return textures;
}
//=================================================
function isAndroid() {
	const userAgent = navigator.userAgent || navigator.vendor || window.opera;
	return /android/i.test(userAgent);
}

//=================================================
var createWebGL = function (canGL) 
{
	let gl = null;
    try
	{
		//support: GLSL ES 1.0 and GLSL ES 3.0 period
		//gl = canGL.getContext('webgl2', { alpha: true, antialias: true });
		//if(!gl) //GLSL ES 1.0
		gl = canGL.getContext('webgl', { alpha: true, antialias: true });
		if(!gl)
			gl = canGL.getContext('experimental-webgl');
    } catch (e) {
        gl = null;
    }

    if (!gl)
	{
        alert('Unable to initialize WebGL. Your browser may not support it.');
        gl = null;
    }
	
    if (gl && !gl.getExtension('OES_texture_float'))
	{
        alert('Fail OES_texture_float');
        gl = null;
	}

	if(gl && !gl.getExtension('OES_texture_float_linear'))
	{
		//  alert('Fail OES_texture_float_linear');
        //gl = null;
	}
	
	if(gl && !gl.getExtension('ANGLE_instanced_arrays'))
	{
		alert('Fail ANGLE_instanced_arrays');
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
