
function initWebGL() {

    var gl; // A global variable for the WebGL context

    var canvas = document.getElementById("glcanvas");

    gl = initWebGLCanvas(canvas);      // Initialize the GL context
  
    // Only continue if WebGL is available and working
  
    if (gl) {
      initShaders();
      initBuffers();
      gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
      gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
      gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things
      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.

      tick();

    }

}

function tick() {               // Ticks forward one frame.
    requestAnimFrame(tick);     // This asks to tick again as soon as the browser is ready to do so (so only when the image is onscreen!)
    drawScene();                // Draw the current scene
    animate();                  // Keep track of time so if you look away and look back, it still seems like time passed i nthe animation
}

function initWebGLCanvas(canvas) {
  gl = null;
  
  try {
    // Try to grab the standard context. If it fails, fallback to experimental.
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  }
  catch(e) {}
  

  // If we don't have a GL context, give up now
  if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
    gl = null;
  }

  gl.viewportWidth = canvas.width;
  gl.viewportHeight = canvas.height;
  
  return gl;
}

function initShaders() {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

function mvPushMatrix() {
    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
      throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

var squareVertexPositionBufferR;
var squareVertexColorBufferR;
var squareVertexPositionBufferG;
var squareVertexColorBufferG;
var squareVertexPositionBufferB;
var squareVertexColorBufferB;

var cubeVertexPositionBuffer;
var cubeVertexColorBuffer;
var cubeVertexIndexBuffer;

var smallcubeVertexPositionBuffer;
var smallcubeVertexColorBuffer;
var smallcubeVertexIndexBuffer;

var rSquare = 0;
var rCube = 0;

function initBuffers() {

    //
    // The red one should have the x-coordinate equal to the value_R, which starts at 0
    //
    squareVertexPositionBufferR = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBufferR);
    var vertices = [
         0.0,  1.0,  1.0,
         0.0, -1.0,  1.0,
         0.0,  1.0, -1.0,
         0.0, -1.0, -1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    squareVertexPositionBufferR.itemSize = 3;
    squareVertexPositionBufferR.numItems = 4;
    
    squareVertexColorBufferR = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBufferR);
    
    // Color everything based on its RGB location.
    colors = colorVerticesRGB(vertices);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    squareVertexColorBufferR.itemSize = 4;
    squareVertexColorBufferR.numItems = 4;

    //
    // The green one should have the y-coordinate equal to the value_G, which starts at 0
    //
    squareVertexPositionBufferG = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBufferG);
    var vertices = [
         1.0,  0.0,  1.0,
        -1.0,  0.0,  1.0,
         1.0,  0.0, -1.0,
        -1.0,  0.0, -1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    squareVertexPositionBufferG.itemSize = 3;
    squareVertexPositionBufferG.numItems = 4;
    
    squareVertexColorBufferG = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBufferG);
    
    // Color everything based on its RGB location.
    colors = colorVerticesRGB(vertices);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    squareVertexColorBufferG.itemSize = 4;
    squareVertexColorBufferG.numItems = 4;



    //
    // The blue one should have the z-coordinate equal to the value_B, which starts at 0
    //
    squareVertexPositionBufferB = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBufferB);
    var vertices = [
         1.0,  1.0,  0.0,
        -1.0,  1.0,  0.0,
         1.0, -1.0,  0.0,
        -1.0, -1.0,  0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    squareVertexPositionBufferB.itemSize = 3;
    squareVertexPositionBufferB.numItems = 4;
    
    squareVertexColorBufferB = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBufferB);
    
    // Color everything based on its RGB location.
    colors = colorVerticesRGB(vertices);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    squareVertexColorBufferB.itemSize = 4;
    squareVertexColorBufferB.numItems = 4;


    // Also draw a small cube at the origin with color 0.5, 0.5, 0.5, 1.0
    prepareSmallCube(0, 0, 0, 0.5, 0.5, 0.5, 1.0);


    cubeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    vertices = [
      // Front face
      -1.0, -1.0,  1.0,
       1.0, -1.0,  1.0,
       1.0,  1.0,  1.0,
      -1.0,  1.0,  1.0,

      // Back face
      -1.0, -1.0, -1.0,
      -1.0,  1.0, -1.0,
       1.0,  1.0, -1.0,
       1.0, -1.0, -1.0,

      // Top face
      -1.0,  1.0, -1.0,
      -1.0,  1.0,  1.0,
       1.0,  1.0,  1.0,
       1.0,  1.0, -1.0,

      // Bottom face
      -1.0, -1.0, -1.0,
       1.0, -1.0, -1.0,
       1.0, -1.0,  1.0,
      -1.0, -1.0,  1.0,

      // Right face
       1.0, -1.0, -1.0,
       1.0,  1.0, -1.0,
       1.0,  1.0,  1.0,
       1.0, -1.0,  1.0,

      // Left face
      -1.0, -1.0, -1.0,
      -1.0, -1.0,  1.0,
      -1.0,  1.0,  1.0,
      -1.0,  1.0, -1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    cubeVertexPositionBuffer.itemSize = 3;
    cubeVertexPositionBuffer.numItems = 24;

    cubeVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);

    // Color everything based on its RGB location.
    unpackedColors = colorVerticesRGB(vertices);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
    cubeVertexColorBuffer.itemSize = 4;
    cubeVertexColorBuffer.numItems = 24;

    cubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    var cubeVertexIndices = [
      0, 1, 2,      0, 2, 3,    // Front face
      4, 5, 6,      4, 6, 7,    // Back face
      8, 9, 10,     8, 10, 11,  // Top face
      12, 13, 14,   12, 14, 15, // Bottom face
      16, 17, 18,   16, 18, 19, // Right face
      20, 21, 22,   20, 22, 23  // Left face
    ]
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
    cubeVertexIndexBuffer.itemSize = 1;
    cubeVertexIndexBuffer.numItems = 36;

}


function prepareSmallCube(x, y, z, cr, cg, cb, co) {

    smallcubeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, smallcubeVertexPositionBuffer);
    vertices = [
      // Front face
      -1.0, -1.0,  1.0,
       1.0, -1.0,  1.0,
       1.0,  1.0,  1.0,
      -1.0,  1.0,  1.0,

      // Back face
      -1.0, -1.0, -1.0,
      -1.0,  1.0, -1.0,
       1.0,  1.0, -1.0,
       1.0, -1.0, -1.0,

      // Top face
      -1.0,  1.0, -1.0,
      -1.0,  1.0,  1.0,
       1.0,  1.0,  1.0,
       1.0,  1.0, -1.0,

      // Bottom face
      -1.0, -1.0, -1.0,
       1.0, -1.0, -1.0,
       1.0, -1.0,  1.0,
      -1.0, -1.0,  1.0,

      // Right face
       1.0, -1.0, -1.0,
       1.0,  1.0, -1.0,
       1.0,  1.0,  1.0,
       1.0, -1.0,  1.0,

      // Left face
      -1.0, -1.0, -1.0,
      -1.0, -1.0,  1.0,
      -1.0,  1.0,  1.0,
      -1.0,  1.0, -1.0,
    ];

    // Shrink the cube and move it to the right place.
    numberofvertices = vertices.length / 3;
    for (var i = 0; i < numberofvertices; i++) {
        vertices[3*i]   = vertices[3*i]   / 3 + x;
        vertices[3*i+1] = vertices[3*i+1] / 3 + y;
        vertices[3*i+2] = vertices[3*i+2] / 3 + z;
    };

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    smallcubeVertexPositionBuffer.itemSize = 3;
    smallcubeVertexPositionBuffer.numItems = 24;

    smallcubeVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, smallcubeVertexColorBuffer);

    color = [cr, cg, cb, co];
    var unpackedColors = [];
    for (var j=0; j < 24; j++) {
            unpackedColors = unpackedColors.concat(color);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
    smallcubeVertexColorBuffer.itemSize = 4;
    smallcubeVertexColorBuffer.numItems = 24;

    smallcubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, smallcubeVertexIndexBuffer);
    var cubeVertexIndices = [
      0, 1, 2,      0, 2, 3,    // Front face
      4, 5, 6,      4, 6, 7,    // Back face
      8, 9, 10,     8, 10, 11,  // Top face
      12, 13, 14,   12, 14, 15, // Bottom face
      16, 17, 18,   16, 18, 19, // Right face
      20, 21, 22,   20, 22, 23  // Left face
    ]
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
    smallcubeVertexIndexBuffer.itemSize = 1;
    smallcubeVertexIndexBuffer.numItems = 36;

}

function colorVerticesRGB(vertices) {

    // To build the colors, we basically want to take x, y, z and hit them all with the function f(w) = (w+1)/2 since that sends -1 to 0 and 1 to 1.
    colors = []
    for (var i = 0; i < vertices.length / 3; i++) {
        colors[4*i]     = (vertices[3*i]     + 1)/2;
        colors[4*i + 1] = (vertices[3*i + 1] + 1)/2;
        colors[4*i + 2] = (vertices[3*i + 2] + 1)/2;
        colors[4*i + 3] = 1.0;
    };

    return colors;

}

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    mat4.identity(mvMatrix);

    mat4.translate(mvMatrix, [-1.5, 0.0, -7.0]);

    mvPushMatrix();
    mat4.rotate(mvMatrix, degToRad(rSquare), [1, 0, 0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBufferR);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBufferR.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBufferR);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, squareVertexColorBufferR.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBufferR.numItems);
    mvPopMatrix();

    mvPushMatrix();
    mat4.rotate(mvMatrix, degToRad(rSquare), [1, 0, 0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBufferG);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBufferG.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBufferG);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, squareVertexColorBufferG.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBufferG.numItems);
    mvPopMatrix();

    mvPushMatrix();
    mat4.rotate(mvMatrix, degToRad(rSquare), [1, 0, 0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBufferB);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBufferB.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBufferB);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, squareVertexColorBufferB.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBufferB.numItems);
    mvPopMatrix();


    mvPushMatrix();
    mat4.rotate(mvMatrix, degToRad(rCube), [1, 0, 0]);
    // We actually want this cube on the same coordinate system as the previous squares. mat4.translate(mvMatrix, [3.0, 0.0, 0.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, smallcubeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, smallcubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, smallcubeVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, smallcubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, smallcubeVertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, smallcubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix();


    mvPushMatrix();
    mat4.rotate(mvMatrix, degToRad(rCube), [1, 0, 0]);
    mat4.translate(mvMatrix, [3.0, 0.0, 0.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix();


}

var lastTime = 0;
function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
      var elapsed = timeNow - lastTime;

      rSquare -= (50 * elapsed) / 1000.0;
      rCube -= (50 * elapsed) / 1000.0;
    }
    lastTime = timeNow;
 }

function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}