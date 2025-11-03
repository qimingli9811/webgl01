"use strict";

//like c++ enum
const sceneType = Object.freeze({
  Triangle: 1,
  Square:   2,
  Cubic:    3,
  Moon:     4
});

//===================================
let gAll = {
  gl: null,
  ctx: null,
  
  uiCanvas: null,
  editBox:  null,
  editBox1: null,
  
  program01: null,
  program02: null,

  renderObj: {},
  myTopButtons: []

  //b: 123,
  //c: "hello",
  //d: true,
  //e: [1, 2, 3],
  //f: { nested: "object" }
};

//===================================

let bPauseCircle = false;
let bPauseObj = false;
let nCircles = 10;
let nCubies = 4;
function setActiveButton(activeBtn)
{
	// Remove 'active' from all, then set the one clicked
	gAll.myTopButtons.forEach(btn => {
		btn.classList.remove("active");
	});

	activeBtn.classList.add("active");
}

let angle = 0;
let nCount = 0;
function renderGL(time)
{
	if(!bPauseObj)
	  angle += 0.01;
	nCount++;
	
    var info = document.getElementById("info");
	if (isAndroid())
	    info.innerHTML = "(Android) " + nCount;
	else
	    info.innerHTML = nCount;

	currentShape.Draw(gAll.gl);

	render2D(time, gAll.ctx, gAll.uiCanvas, mousePos);
	requestAnimationFrame(renderGL);
}

gAll.uiCanvas = document.getElementById('my2D');
gAll.editBox = document.getElementById('editBox');
gAll.editBox1 = document.getElementById('editBox1');
gAll.editBox.value = nCircles;
gAll.editBox1.value = nCubies;
gAll.editBox1.style.display = "none";

// Text change events
function TextChange(e)
{
	if(this == editBox)
	{
		const old = nCircles;
		nCircles = parseInt(this.value) || nCircles;
		if(isNaN(nCircles))
			nCircles = old;
		else if(nCircles < 0)
			nCircles = 0;
		else if(nCircles > 2000)
			nCircles = 2000;
		this.value = nCircles;
	}
	else if(this == editBox1)
	{
		const old = nCubies;
		nCubies = parseInt(this.value);	
		if(isNaN(nCubies))
			nCubies = old;
		else if(nCubies < 0)
			nCubies = 0;
		else if(nCubies > 4)
			nCubies = 4;
		this.value = nCubies;
	}
}

editBox.addEventListener("keydown", function(e)
{
	if (e.key == "Enter")
	{
		// `this` refers to the edit box that fired the event
		//const text = this.value;
		//const id = this.id;
		//console.log("Edit box ID:", id, "Value:", text);
		TextChange(e);
			
		//gAll.uiCanvas.tabIndex = 0;
		//gAll.uiCanvas.focus();
	}
});

editBox1.addEventListener("keydown", function(e)
{
	if (e.key == "Enter")
		TextChange(e);
});
  
editBox.addEventListener('input', () => {
  console.log('myTyping:', editBox.value);
});

editBox.addEventListener('change', TextChange);
editBox1.addEventListener('change', TextChange);

// --- Define 3 buttons inside canvas ---
const uiButtons = [
  { x: 25, y: 20,  width: 80, height: 25, id : 0, label: 'Pause Circle', visible: true, checked: false },
  { x: 25, y: 60,  width: 80, height: 25, id : 1, label: 'Pause Obj',    visible: true, checked: false },
  { x: 25, y: 100, width: 80, height: 25, id : 2, label: 'Button 3', visible: true, checked: false },
  { x: 25, y: 140, width: 80, height: 25, id : 3, label: 'Btn',    visible: true, checked: false },
  { x: 25, y: 180, width: 80, height: 25, id : 4, label: 'Button 3', visible: true, checked: false }
];

let currentShape = null;
function OnBtnClick(e)
{
	const nShape = e.currentTarget.id;
	setActiveButton(e.currentTarget);
	//console.log(`A button was clicked! Its text is: ${e.currentTarget.textContent}`);	
	//alert(e.currentTarget.id + "=" + sceneType.Triangle);
	
	editBox1.style.display = "none";
	if(nShape == sceneType.Square)
	{
		currentShape = gAll.renderObj["Square"];

		uiButtons[2].visible = false;
		uiButtons[3].visible = false;
		uiButtons[4].visible = false;
	}
	else if(nShape == sceneType.Triangle)
	{	
		currentShape = gAll.renderObj["Trangle"];
		uiButtons[2].visible = true;
		uiButtons[3].visible = true;
		uiButtons[4].visible = true;
	}
	else if(nShape == sceneType.Cubic)
	{
		currentShape = gAll.renderObj["Cubic"];
		editBox1.style.display = "block";
	}
	else if(nShape == sceneType.Moon)
	{
		currentShape = gAll.renderObj["Moon"];
	}
	else
		return;

	currentShape.loadShape(gAll.gl);
}

// Draw rounded rect helper
function drawRoundedRect(ctx, x, y, width, height, radius, fillStyle, strokeStyle)
{
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();

	ctx.fillStyle = fillStyle;
	ctx.fill();
	ctx.strokeStyle = strokeStyle;
	ctx.lineWidth = 2;
	ctx.stroke();
}

let tElapseX = Math.random();
let tElapseY = Math.random();
function Draw_circles(time, ctx, ui2D)
{
	if(!bPauseCircle)
	{
		tElapseX += 0.005;
		tElapseX += 0.002;
	}

	const w = ui2D.width;
	const h = ui2D.height;
	ctx.clearRect(0, 0, w, h);
	
	const t = tElapseX;
	const t2 = tElapseY;
	// draw glowing circles over WebGL background
	for (let i = 0; i < nCircles; i++) {
	  const x = w / 2 + Math.sin(t + i) * w * 0.45;
	  const y = h / 2 + Math.cos(t + i * t2) * h * 0.45;
	  const r = 20 + 10 * Math.sin(t + i * 2);
	  const hue = (t * 60 + i * 36) % 360;
	  ctx.beginPath();
	  ctx.arc(x, y, r, 0, Math.PI * 2);
	  ctx.fillStyle = `hsla(${hue}, 100%, 60%, 0.7)`;
	  ctx.shadowColor = `hsla(${hue}, 100%, 70%, 0.8)`;
	  ctx.shadowBlur = 15;
	  ctx.fill();
	}
}

function render2D(time, ctx, ui2D, mouse)
{
	ctx.clearRect(0, 0, ui2D.width, ui2D.height);
	Draw_circles(time, ctx, ui2D);
	
	for (const btn of uiButtons)
	{
		if (!btn.visible) continue; // skip invisible buttons

		// Check if hovering
		const isHover = mouse.x >= btn.x && mouse.x <= btn.x + btn.width &&
			mouse.y >= btn.y && mouse.y <= btn.y + btn.height;

		// Gradient background
		const grad = ctx.createLinearGradient(btn.x, btn.y, btn.x, btn.y + btn.height);
		if (isHover) {
			grad.addColorStop(0, '#ffffff33');
			grad.addColorStop(1, '#ffffff66');  
		} else {
			grad.addColorStop(0, '#ffffff11');
			grad.addColorStop(1, '#ffffff22');
		}

		if(btn.checked)
		{
			grad.addColorStop(0, '#ff0000ff');
			grad.addColorStop(1, '#00ff00ff');
		}

		// Draw rounded button
		if (isHover)
		{
			drawRoundedRect(ctx, btn.x, btn.y, btn.width, btn.height, 12, grad, 'white');
			ctx.fillStyle = 'white';
		}
		else
		{
			drawRoundedRect(ctx, btn.x, btn.y, btn.width, btn.height, 12, grad, '#ffffff33');
			ctx.fillStyle = '#ffffff22';
		}
		
		// Draw text
		ctx.font = '12px sans-serif';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(btn.label, btn.x + btn.width / 2, btn.y + btn.height / 2);
	}
}

// Track mouse position
let mousePos = { x: 0, y: 0 };
//NOTE: arrow function does not have "this"
//gAll.uiCanvas.addEventListener('mousemove', (e) => {
gAll.uiCanvas.addEventListener('mousemove', function(e) {
  const rect = this.getBoundingClientRect();
  mousePos.x = e.clientX - rect.left;
  mousePos.y = e.clientY - rect.top;
});

// Handle clicks
//NOTE: arrow function does not have "this"
//gAll.uiCanvas.addEventListener('click', () => {
gAll.uiCanvas.addEventListener('click', function() {
  for (let i = 0; i < uiButtons.length; i++) {
    const btn = uiButtons[i];
    if (!btn.visible) continue;

    if (mousePos.x >= btn.x && mousePos.x <= btn.x + btn.width &&
        mousePos.y >= btn.y && mousePos.y <= btn.y + btn.height) {

		btn.checked = !btn.checked;

      // Action for button 1: hide button 3
	  if (btn.id == 0)
  		bPauseCircle = btn.checked;
      else if (btn.id == 1)
	  bPauseObj =  btn.checked;
      //uiButtons[2].visible = uiButtons[2].visible == false;

	  //if(btn.id != 0)
	  //alert(btn.label + ' clicked!');
	}
  }
});

// Draw rounded rectangle
function drawRoundedRect(ctx, x, y, width, height, radius, fillStyle, strokeStyle) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();

  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function AddTopButtons()
{
    // --- Button Controls ---
    //const triangleBtn = document.getElementById("triangleBtn");
    //const squareBtn = document.getElementById("squareBtn");

	const btnNodes = document.querySelectorAll('.myButton');
	gAll.myTopButtons = Array.from(btnNodes);
	//alert(gAll.myTopButtons.length);
	gAll.myTopButtons.forEach(button => {
		button.addEventListener('click', OnBtnClick);
	});
}	

function main() 
{
    const canvas = document.getElementById("myGL");
	if(isAndroid())
	{
		canvas.width = 480;
		canvas.height = 640;
	}
	
	//const Btns = document.querySelectorAll("input");
	//Btns.forEach(btn => {
	//	console.log(btn.id + "== [" + btn.value + "]");
	//});

	const gl = createWebGL(canvas);
    if (!gl) {
      alert("WebGL not supported");
      throw new Error("WebGL not supported");
    }

	gAll.gl = gl;
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
	const ext = gl.getExtension('ANGLE_instanced_arrays');
	if (!ext)
		return alert('need ANGLE_instanced_arrays');

	gAll.program01 = initShaderProgram(gl, vsSimple, fsSimple);
	gAll.program02 = initShaderProgram(gl, vsSimple2, fsSimple2);
	gAll.programCubic = initShaderProgram(gl, vsCubic, fsCubic);
	gAll.programMoon = initShaderProgram(gl, vsMoon, psMoon);
	
	gAll.renderObj["Trangle"] = new RenderTriange(gAll.program01);
	gAll.renderObj["Square"]  = new RenderSquare(gAll.program02);
	gAll.renderObj["Cubic"]   = new RenderCubic(gAll.programCubic);
	gAll.renderObj["Moon"]    = new RenderMoon(gAll.programMoon);

	currentShape = gAll.renderObj["Trangle"];
	
	const ui2D = gAll.uiCanvas;
	gAll.ctx = ui2D.getContext('2d');
	ui2D.width = canvas.width;
	ui2D.height = canvas.height;
	
	const wrapper = document.querySelector(".canvas-wrapper");
	wrapper.style.width = canvas.width + "px";
	wrapper.style.height = canvas.height + "px";

	AddTopButtons();

    // --- Initialize & Render ---
    currentShape.loadShape(gAll.gl);
	//alert(getAllItems(gAll));

    renderGL();
}

window.onload = main;
