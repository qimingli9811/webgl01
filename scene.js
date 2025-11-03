class RenderBase
{
	//#ssn; // private
	//ssn; // public

	type = sceneType.Triangle;
	program = null;
	buffer = null;
	vetexCount = 0;

	//-------------------------------
	constructor(type = sceneType.Triangle, program) {
		this.type = type;
		this.program = program;
	}

	//-------------------------------
	loadShape(gl)
	{
	  gl.useProgram(this.program);

	  const vertices = this.getVertices();
		
	  let buffer = gl.createBuffer(); 
	  this.buffer = buffer;
	  
	  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	  const program = this.program;
	  const FSIZE = Float32Array.BYTES_PER_ELEMENT;
	  
	  const aPosition = gl.getAttribLocation(program, "aPosition");
	  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, FSIZE * 5, 0);
	  gl.enableVertexAttribArray(aPosition);

	  const aColor = gl.getAttribLocation(program, "aColor");
	  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
	  gl.enableVertexAttribArray(aColor);
	}

	Draw(gl)
	{
		//const program = this.program;
  	    const program = this.program;
		gl.useProgram(program);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

		const uAngle = gl.getUniformLocation(program, "uAngle");
		gl.uniform1f(uAngle, angle);
		gl.clearColor(0.05, 0.05, 0.1, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
	}
}

//=====================================================
class RenderTriange extends RenderBase
{
	//#ssn; // private
	//ssn; // public
	//constructor(name, breed) {
	//	this.name = name;
	//	this.breed = breed;
	//}

	constructor(program) {
		super(sceneType.Triangle, program);
	}

	getVertices()
	{
	  const vertices = new Float32Array([
		  0.0,  0.7,   1.0, 1.0, 0.0,
		 -0.7, -0.7,   0.0, 1.0, 1.0,
		  0.7, -0.7,   1.0, 0.0, 1.0
		]);
	    this.vertexCount = 3;
		return vertices;
	}
	
/*	Draw3()
	{
		super.Draw();
	}
	*/
}

class RenderSquare extends RenderBase
{
	constructor(program) {
		super(sceneType.Triangle, program);
	}
	
	getVertices()
	{
		const vertices = new Float32Array([
		  -0.5,  0.5,   1, 0, 0,
		  -0.5, -0.5,   0, 1, 0,
		   0.5,  0.5,   0, 0, 1,

		   0.5,  0.5,   0, 0, 1,
		  -0.5, -0.5,   0, 1, 0,
		   0.5, -0.5,   1, 1, 0
		]);
	    this.vertexCount = 6;
		return vertices;
	}

	Draw3()
	{
		super.Draw();
	}
}

//=====================================================
class RenderCubic extends RenderBase
{
	constructor(program) {
		super(sceneType.Cubic, program);
	}

	#indexBuffer;
	loadShape(gl)
	{
		  // x, y, z, u, v
		  const vertices = new Float32Array([
		  // +X face
		   0.5, -0.5, -0.5, 1.0, 0.0,
		   0.5,  0.5, -0.5, 1.0, 1.0,
		   0.5,  0.5,  0.5, 0.0, 1.0,
		   0.5, -0.5,  0.5, 0.0, 0.0,

		  // -X face
		  -0.5, -0.5,  0.5, 1.0, 0.0,
		  -0.5,  0.5,  0.5, 1.0, 1.0,
		  -0.5,  0.5, -0.5, 0.0, 1.0,
		  -0.5, -0.5, -0.5, 0.0, 0.0,

		  // +Y face
		  -0.5,  0.5, -0.5, 0.0, 0.0,
		  -0.5,  0.5,  0.5, 0.0, 1.0,
		   0.5,  0.5,  0.5, 1.0, 1.0,
		   0.5,  0.5, -0.5, 1.0, 0.0,

		  // -Y face
		  -0.5, -0.5,  0.5, 0.0, 0.0,
		  -0.5, -0.5, -0.5, 0.0, 1.0,
		   0.5, -0.5, -0.5, 1.0, 1.0,
		   0.5, -0.5,  0.5, 1.0, 0.0,

		  // +Z face
		  -0.5, -0.5,  0.5, 0.0, 0.0,
		   0.5, -0.5,  0.5, 1.0, 0.0,
		   0.5,  0.5,  0.5, 1.0, 1.0,
		  -0.5,  0.5,  0.5, 0.0, 1.0,

		  // -Z face
		   0.5, -0.5, -0.5, 0.0, 0.0,
		  -0.5, -0.5, -0.5, 1.0, 0.0,
		  -0.5,  0.5, -0.5, 1.0, 1.0,
		   0.5,  0.5, -0.5, 0.0, 1.0,
		]);

		const indices = new Uint16Array([
			0,1,2, 0,2,3,     // +X
			4,5,6, 4,6,7,     // -X
			8,9,10, 8,10,11,  // +Y
			12,13,14, 12,14,15,// -Y
			16,17,18, 16,18,19,// +Z
			20,21,22, 20,22,23 // -Z
		]);
		
	  this.buffer = gl.createBuffer();
	  
	  gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
	  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	  const program = this.program;
	  const FSIZE = Float32Array.BYTES_PER_ELEMENT;

	  const aPosition = gl.getAttribLocation(program, "aPosition");
	  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, FSIZE * 5, 0);
	  gl.enableVertexAttribArray(aPosition);

	  const aTex = gl.getAttribLocation(program,"aTexCoord");
	  if(aTex != -1)
	  {
		gl.vertexAttribPointer(aTex,2,gl.FLOAT,false,FSIZE*5,FSIZE*3);
		gl.enableVertexAttribArray(aTex);
	  }

	  this.#indexBuffer = gl.createBuffer();
	  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.#indexBuffer);
	  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW);
	}
	
	//================
	xRot = [0, 0, 0, 0, 0];
	zPos = 5;
	zT = 5;
	zT1 = 3;
	moving = { x: 0, inc: 0.03, y: 0, incY: 0.01};
	textures = [];

	generateFace(ctx, faceColor, textColor, text)
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

    CreateMatrix() {
		let m = mat4.create();
		mat4.identity(m);
		return m;
	}

	xRotA = 0;
    Draw_Square(gl, aspect, program) {
		let projectionMatrix = this.CreateMatrix();
		let modelMatrix = this.CreateMatrix();
		let cameraMatrix = this.CreateMatrix();
				
		if(!bPauseObj)
		  this.xRotA += 0.1 + 5 * 0.2;

mat4.ortho(-aspect, aspect, -1, 1, -1, 1, projectionMatrix);
mat4.scale(modelMatrix, [1.5, 1.5, 1.0]);
mat4.rotate(modelMatrix, 0.017453292 * this.xRotA, [1, 0, 1]);  //pi/180=0.017453292

		const projMatrixLoc = gl.getUniformLocation(program, "projMatrix");
		const cameraMatrixLoc = gl.getUniformLocation(program, "cameraMatrix");
		const modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");
		const nTypeLoc = gl.getUniformLocation(program, "nType");
		const nTypeLoc1 = gl.getUniformLocation(program, "nType1");

		gl.uniformMatrix4fv(projMatrixLoc, false, projectionMatrix);
		gl.uniformMatrix4fv(cameraMatrixLoc, false, cameraMatrix);
		gl.uniformMatrix4fv(modelMatrixLoc, false, modelMatrix);
		gl.uniform1i(nTypeLoc, 1);
		gl.uniform1i(nTypeLoc1, 1);

		{
			gl.bindTexture(gl.TEXTURE_2D,this.textures[4]);
			gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 4*6*Uint16Array.BYTES_PER_ELEMENT);
		}
	}

	Draw(gl)
	{
  	    const program = this.program; //this.program;	
		if(!this.program || !this.buffer || !this.#indexBuffer || this.program != gAll.programCubic)
			alert("failed");
		gl.useProgram(program);
			
	    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
	    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.#indexBuffer);

		//super.Draw();
		gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);

        gl.clearColor(0.1, 0.1, 0.1, 1.0); // Set background color
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
		//console.log(aspect);

		const texLoc = gl.getUniformLocation(program, "uTexture");
		// Tell the shader to use texture unit 0 for uTexture
		if(texLoc)
		{
			gl.uniform1i(texLoc, 0);
			gl.activeTexture(gl.TEXTURE0);
		}
		const projMatrixLoc = gl.getUniformLocation(program, "projMatrix");
		const cameraMatrixLoc = gl.getUniformLocation(program, "cameraMatrix");
		const modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");
		const nTypeLoc = gl.getUniformLocation(program, "nType");
		const nTypeLoc1 = gl.getUniformLocation(program, "nType1");
		if(nTypeLoc)
			gl.uniform1i(nTypeLoc, 0);
		if(nTypeLoc1)
			gl.uniform1i(nTypeLoc1, 0);
	
		const projectionMatrix = mat4.create();
		const cameraMatrix = mat4.lookAt([0, 0, 1], [0, 0, 0], [0, 1, 0]);
		let modelMatrix = mat4.create();

		mat4.perspective(45, aspect, 0.1, 2000.0, projectionMatrix);
		
		if(this.textures.length < 1)
			this.textures = Create_6_Textures(gl);

		for(let nB = 0; nB < nCubies; nB++)
		{
			let nA = nB % 3;

			mat4.identity(modelMatrix);
			
			this.zPos += 0.000;
			mat4.translate(modelMatrix, [nB*2.0-3, (this.zPos-2)/5.0, -this.zPos]);
			if(!bPauseObj)
			  this.xRot[nA] += 0.1 + nA * 0.2;
			mat4.rotate(modelMatrix, 0.017453292 * this.xRot[nA], [0, 0, 1]);  //pi/180=0.017453292
			mat4.rotate(modelMatrix, 0.017453292 * this.xRot[nA], [1, 0, 0]);  //pi/180=0.017453292
			//mat4.rotate(modelMatrix, 0.017453292 * xRot[nA], [0, 1, 0]);  //pi/180=0.017453292

			if(projMatrixLoc)
				gl.uniformMatrix4fv(projMatrixLoc, false, projectionMatrix);
			if(cameraMatrixLoc)
				gl.uniformMatrix4fv(cameraMatrixLoc, false, cameraMatrix);
			if(modelMatrixLoc)
				gl.uniformMatrix4fv(modelMatrixLoc, false, modelMatrix);

			for(let i = 0; i < 6; i++)
			{
				gl.bindTexture(gl.TEXTURE_2D,this.textures[i]);
				gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, i*6*Uint16Array.BYTES_PER_ELEMENT);
			}
		}
		
		this.Draw_Square(gl, aspect, program);
	}
}

//=====================================================
class RenderMoon extends RenderBase
{
	constructor(program) {
		super(sceneType.Moon, program);
	}

	initSphere(gl)
	{
		const latBands = 100;
		const longBands = 100;
		const radius = 1;
		
		const positions = [];
		const texCoords = [];
		const normals = [];
		const indices = [];

		for (let lat = 0; lat <= latBands; ++lat)
		{
			const theta = lat * Math.PI / latBands;
			const sinT = Math.sin(theta);
			const cosT = Math.cos(theta);

			for (let lon = 0; lon <= longBands; ++lon) 
			{
			  const phi = lon * 2 * Math.PI / longBands;
			  const sinP = Math.sin(phi);
			  const cosP = Math.cos(phi);

			  const x = cosP * sinT;
			  const y = cosT;
			  const z = sinP * sinT;
			  const u = 1 - (lon / longBands);
			  const v = 1 - (lat / latBands);

			  positions.push(radius * x, radius * y, radius * z);
			  normals.push(x, y, z);
			  texCoords.push(u, v);
			}
		}

		for (let lat = 0; lat < latBands; ++lat)
		{
			for (let lon = 0; lon < longBands; ++lon)
			{
			  const a = lat * (longBands + 1) + lon;
			  const b = a + longBands + 1;
			  indices.push(a, b, a + 1, b, b + 1, a + 1);
			}
		}

		return { positions, texCoords, normals, indices };
	}

	createBuffer(gl, data, type = gl.ARRAY_BUFFER, usage = gl.STATIC_DRAW) 
	{
		const buf = gl.createBuffer();
		gl.bindBuffer(type, buf);
		gl.bufferData(type, data, usage);
		return buf;
	}

	posBuf;
	texBuf;
	normBuf;
	idxBuf;
	aPosition;
	aTexCoord;
	textures = [];
    texIndex = 1;
	loadShape(gl)
	{
		if(this.textures.length < 1)
		{		
			//	this.textures[0] = TexFromImage(gl, 'moon.jpg');
			this.textures[0] = TexFromImage(gl, 'earth.jpg');
			this.textures[1] = TexFromImage(gl, 'moon.jpg');
		
			//this.textures = Create_6_Textures(gl);
			//alert(this.textures[0]);
		}
		
		gl.bindTexture(gl.TEXTURE_2D, this.textures[this.texIndex % 2]);
		this.texIndex++;
		
		gl.useProgram(this.program);
		this.sphere = this.initSphere(gl);

		this.posBuf = this.createBuffer(gl, new Float32Array(this.sphere.positions));
		this.texBuf = this.createBuffer(gl, new Float32Array(this.sphere.texCoords));
		this.normBuf = this.createBuffer(gl, new Float32Array(this.sphere.normals));
		this.idxBuf = this.createBuffer(gl, new Uint16Array(this.sphere.indices), gl.ELEMENT_ARRAY_BUFFER);
		
		this.aPosition = gl.getAttribLocation(this.program, 'aPosition');
		this.aTexCoord = gl.getAttribLocation(this.program, 'aTexCoord');

		gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuf);
		gl.enableVertexAttribArray(this.aPosition);
		gl.vertexAttribPointer(this.aPosition, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuf);
		gl.vertexAttribPointer(this.aTexCoord, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.aTexCoord);

		const aNormal = gl.getAttribLocation(this.program, 'aNormal');
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normBuf);
		gl.enableVertexAttribArray(aNormal);
		gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);
	}
	
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
	}

	identity() {
	  return [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
	}

	translate(m, x, y, z) {
	  const out = m.slice();
	  out[12] = x; out[13] = y; out[14] = z;
	  return out;
	}

	multiply(a, b) 
	{
		const out = new Array(16);
		for (let i = 0; i < 4; i++)
		{
			for (let j = 0; j < 4; j++)
			{
				out[i*4+j] = a[i*4+0]*b[0*4+j] + a[i*4+1]*b[1*4+j] +
					a[i*4+2]*b[2*4+j] + a[i*4+3]*b[3*4+j];
			}
		}
		return out;
    }

	rotateY(m, angle) {
	  const c = Math.cos(angle), s = Math.sin(angle);
	  const r = this.identity();
	  r[0] = c; r[2] = s; r[8] = -s; r[10] = c;
	  return this.multiply(m, r);
	}

	angle = 0;
	Draw(gl)
	{
  	    const program = this.program; //this.program;
		gl.useProgram(program);
		gl.clearColor(0.5, 0.05, 0.1, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.disable(gl.CULL_FACE);
		//gl.cullFace(gl.BACK);
		//gl.disable(gl.BLEND);
		gl.enable(gl.DEPTH_TEST);

//		const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

  const proj = this.perspective(Math.PI / 3, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100);
  const view = this.translate(this.identity(), 0, 0, -3);
  const model = this.rotateY(this.identity(), angle);

	const uModel = gl.getUniformLocation(program, 'uModel');
const uView = gl.getUniformLocation(program, 'uView');
const uProj = gl.getUniformLocation(program, 'uProj');

  gl.uniformMatrix4fv(uProj, false, proj);
  gl.uniformMatrix4fv(uView, false, view);
  gl.uniformMatrix4fv(uModel, false, model);

  gl.drawElements(gl.TRIANGLES, this.sphere.indices.length, gl.UNSIGNED_SHORT, 0);

  this.angle += 0.01;
  
        //this.drawSphere(gl, program, this.textures[0]);
		//gl.enable(gl.BLEND);
	}
}
