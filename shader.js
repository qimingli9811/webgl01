"use strict";

const vsSource = `
  attribute vec2 aPosition;
  attribute vec3 aColor;
  varying vec3 vColor;
  uniform float uAngle;
  void main() {
	float cosA = cos(uAngle);
	float sinA = sin(uAngle);
	mat2 rot = mat2(cosA, -sinA, sinA, cosA);
	gl_Position = vec4(rot * aPosition, 0.0, 1.0);
	vColor = aColor;
  }
`;

const fsSource = `
  precision mediump float;
  varying vec3 vColor;
  void main() {
	gl_FragColor = vec4(vColor, 1.0);
  }
`;
