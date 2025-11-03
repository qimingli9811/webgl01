"use strict";

const vsSimple = `
  attribute vec2 aPosition;
  attribute vec3 aColor;
  attribute vec2 aTexCoord;

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

const fsSimple = `
  precision mediump float;
  varying vec3 vColor;
  void main() {
	gl_FragColor = vec4(vColor, 1.0);
  }
`;

//======================================================
const vsSimple2 = `
  attribute vec2 aPosition;
  attribute vec3 aColor;
  varying vec2 vTexCoord;
  
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

const fsSimple2 = `
  precision mediump float;
  varying vec3 vColor;
  void main() {
	gl_FragColor = vec4(vColor, 1.0);
  }
`;

//======================================================
const vsCubic = `
	attribute vec4 aPosition;
	attribute vec2 aTexCoord;

	varying vec2 vTexCoord;

	uniform int  nType; // A uniform is accessible in both shaders
	uniform mat4 projMatrix;
	uniform mat4 cameraMatrix;
	uniform mat4 modelMatrix;

	void main1() {
gl_Position = vec4(aPosition.x, aPosition.y, 0.0, 1.0);		
	}
	
	void main() {
		//MVP = Projection × View × Model

		mat4 mtx = projMatrix * cameraMatrix * modelMatrix;
		//mtx = mat4(1.0);		
		gl_Position = mtx * vec4(aPosition.xyz, 1.0);
		
		vTexCoord = aTexCoord;
	}
`;

const fsCubic = `
	//precision highp float;
	precision mediump float;
	precision highp int;   //int in vertex-shader is highp, default for fs is mediump
	varying vec2 vTexCoord;
	
	uniform int  nType; // A uniform is accessible in both shaders
	uniform int  nType1; // A uniform is accessible in both shaders
	uniform sampler2D uTexture;

	void main() {
	   vec3 color = vec3(0.5, 0.9, 0.5);
		//gl_FragColor = vec4(color, 1.0);
		//gl_FragColor = vec4(color, 1.0) * 0.5 + 0.5*texture2D(uTexture, vTexCoord);
		color = texture2D(uTexture, vTexCoord).xyz;
		
		// Circle mask
		float dist = distance(vTexCoord, vec2(0.5, 0.5));
		if (dist >= 0.49)
		{			
			float alpha = 1.0 - smoothstep(0.49, 0.5, dist);
			if (dist > 0.49)
			{
				if(nType == 0)
					gl_FragColor = vec4(0.5, 0.5, 0.5, 0.3);
				else if(nType == 1)
					gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
			}
			else
				gl_FragColor = vec4(0.5, 0.9, 0.5, alpha);
		}
		else
		{
			if(nType1 == 0)
				gl_FragColor = vec4(color, 1.0);
			else
				gl_FragColor = vec4(color, 0.7);
		}
	}
`;
//======================================================
const vsMoon1 = `                
    attribute vec3 aPosition;       
    attribute vec3 aNormal;         
    attribute vec2 aTextureCoord;   
                                    
    uniform mat4 modelviewMatrix;   
    uniform mat4 projMatrix;        
    uniform mat3 normalMatrix;      
                                    
    uniform vec3 uAmbientColor;     
                                    
    uniform vec3 vLightingDirection;
    uniform vec3 vDirectionalColor; 
                                    
    uniform bool bUseLighting;      
                                    
    varying vec2 vTextureCoord;     
    varying vec3 vLightWeighting;   
                                    
    void main(void) {               
        gl_Position = projMatrix * modelviewMatrix * vec4(aPosition, 1.0);
        vTextureCoord = aTextureCoord;              
                                                    
        if (!bUseLighting) {                        
            vLightWeighting = vec3(1.0, 1.0, 1.0);  
        } else {                                    
            vec3 transformedNormal = normalMatrix * aNormal; 
            float directionalLightWeighting = max(dot(transformedNormal, vLightingDirection), 0.0); 
            vLightWeighting = uAmbientColor + vDirectionalColor * directionalLightWeighting;
        }
		
gl_Position = vec4(aPosition, 1.0);
vLightWeighting = aPosition;
    }
	`;

const psMoon1 = `                    
    precision mediump float; 	    
					                
    varying vec2 vTextureCoord; 	
    varying vec3 vLightWeighting; 	
    uniform float fAlpha;           
 						            
    uniform sampler2D uSampler;

    void main(void)                 
    {
		float ff = fAlpha;
        gl_FragColor = vec4(vLightWeighting, 1.0); 	    
    }

    void main1(void)                 
    { 			                    
        vec4 clr = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
        gl_FragColor = vec4(clr.rgb * vLightWeighting, clr.a * fAlpha); 	    
    }
	`;
//======================================================
const vsMoon = `
	attribute vec3 aPosition;
	attribute vec2 aTexCoord;
	attribute vec3 aNormal;
	uniform mat4 uModel;
	uniform mat4 uView;
	uniform mat4 uProj;
	varying vec3 vNormal;
	varying vec2 vTexCoord;
	void main() {
	  vNormal = mat3(uModel) * aNormal;
	  gl_Position = uProj * uView * uModel * vec4(aPosition, 1.0);
	  vTexCoord = aTexCoord;
	}
`;

const psMoon = `
	precision mediump float;
	varying vec3 vNormal;
	varying vec2 vTexCoord;
	uniform sampler2D uSampler;
	void main() 
	{
	  vec3 lightDir = normalize(vec3(0.5, 0.7, 1.0));
	  float diff = max(dot(normalize(vNormal), lightDir), 0.0);
	  vec3 color = vec3(0.3, 0.6, 1.0) * diff + vec3(0.05);
	  gl_FragColor = vec4(color, 1.0);
	  gl_FragColor = texture2D(uSampler, vTexCoord);
	}
`;
