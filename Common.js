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

function isiPhone() {
	const userAgent = navigator.userAgent || navigator.vendor || window.opera;
	return /iPhone/i.test(userAgent);
}

//=================================================
/*
const Mtx = {
	perspective(fov, aspect, near, far) 
	{
		const f = 1.0 / Math.tan(fov / 2);
		const rangeInv = 1 / (near - far);
		return [
			f / aspect, 0, 0, 0,
			0, f, 0, 0,
			0, 0, (near + far) * rangeInv, -1,
			0, 0, near * far * rangeInv * 2, 0
		];
	},
	
	ortho(left, right, bottom, top, near, far)
	{
		const lr = 1 / (left - right);
		const bt = 1 / (bottom - top);
		const nf = 1 / (near - far);
		return [
		  -2 * lr, 0, 0, 0,
		  0, -2 * bt, 0, 0,
		  0, 0, 2 * nf, 0,
		  (left + right) * lr,
		  (top + bottom) * bt,
		  (far + near) * nf,
		  1
		];
	  },
	  
	lookAt(eye, target, up) {
		const [ex, ey, ez] = eye;
		const [tx, ty, tz] = target;
		const [ux, uy, uz] = up;

		// zAxis = normalize(eye - target)
		let zx = ex - tx, zy = ey - ty, zz = ez - tz;
		const zLen = Math.hypot(zx, zy, zz);
		zx /= zLen; zy /= zLen; zz /= zLen;

		// xAxis = normalize(cross(up, zAxis))
		let xx = uy * zz - uz * zy;
		let xy = uz * zx - ux * zz;
		let xz = ux * zy - uy * zx;
		const xLen = Math.hypot(xx, xy, xz);
		xx /= xLen; xy /= xLen; xz /= xLen;

		// yAxis = cross(zAxis, xAxis)
		const yx = zy * xz - zz * xy;
		const yy = zz * xx - zx * xz;
		const yz = zx * xy - zy * xx;

		return [
		  xx, yx, zx, 0,
		  xy, yy, zy, 0,
		  xz, yz, zz, 0,
		  -(xx * ex + xy * ey + xz * ez),
		  -(yx * ex + yy * ey + yz * ez),
		  -(zx * ex + zy * ey + zz * ez),
		  1
		];
	  },
	  
	identity() {
	  return [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
	},

	translateA(m, x, y, z) {
	  const out = m.slice();
	  out[12] = x; out[13] = y; out[14] = z;
	  return out;
	},

	translate(m, x, y, z) {
		const tm = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		x, y, z, 1];
		return this.multiply(m, tm);
	},

	multiply(a, b) 
	{
		const out = new Array(16);
		for (let i = 0; i < 4; i++)
		{
			for (let j = 0; j < 4; j++)
				out[i*4+j] = a[i*4+0]*b[0*4+j] + a[i*4+1]*b[1*4+j] + a[i*4+2]*b[2*4+j] + a[i*4+3]*b[3*4+j];
		}
		return out;
	},

	rotateX(m, angle) {
		const c = Math.cos(angle), s = Math.sin(angle);
		const r = this.identity();
		r[5] = c; r[6] = -s; r[9] = s; r[10] = c;
		return this.multiply(m, r);
	},

	//Math.sin(a): a in radians, not degrees
	rotateY(m, angle)
	{
	  const c = Math.cos(angle), s = Math.sin(angle);
	  const r = this.identity();
	  r[0] = c; r[2] = s; r[8] = -s; r[10] = c;
	  return this.multiply(m, r);
	},

	rotateZ(m, angle) {
		const c = Math.cos(angle), s = Math.sin(angle);
		const r = this.identity();
		r[0] = c; r[1] = -s; r[4] = s; r[5] = c;
		return this.multiply(m, r);
	},
	
	rotate(m, angle, axis)
	{
		let [x, y, z] = axis;	
		if(x != 0)
			m = this.rotateX(m, angle);
		if(y != 0)
			m = this.rotateY(m, angle);
		if(z != 0)
			m = this.rotateZ(m, angle);
		return m;
	},

	scale(m, sx, sy, sz) {
		const sm = [
		sx, 0,  0,  0,
		0,  sy, 0,  0,
		0,  0,  sz, 0,
		0,  0,  0,  1
		];
		return this.multiply(m, sm);
	}
};
*/

//=================================================
var createWebGL = function (canGL) 
{
	let gl = null;
    try
	{
		//support: GLSL ES 1.0 and GLSL ES 3.0 period
		//gl = canGL.getContext('webgl2', { alpha: true, antialias: false });
		//if(!gl) //GLSL ES 1.0
		gl = canGL.getContext('webgl', { alpha: true, antialias: true, depth: true });
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
