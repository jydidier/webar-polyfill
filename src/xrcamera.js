


// function that should have the same prototype as the one for calling animation frames.
// two phases: 1. init, 2. render new frames
// in init: setup cameras + special object
// in render: lazy instanciation of shaders, then rendering if needed

// gl: webgl-context for all of this

var ARShader = function(gl) {
    // is the matrix needed --> yes 
    
    // first, here are the two shaders we need.
    const vsString = `
        attribute vec2 a_position;
        varying vec2 v_texcoord;
        const mat4 c_matrix = mat4(
            2,0,0,-1,
            0,2,0,-1,
            0,0,-1,0,
            0,0,0,1            
        );
        void main() {
            gl_Position = c_matrix * vec4(a_position,1,1);
            v_texcoord = a_position;
        }
    `;
    const fsString = `
        precision mediump float;
        varying vec2 v_texcoord;
        uniform sampler2D u_texture;
        void main() {
            gl_FragColor = texture2D(u_texture, v_texcoord);
        }
    `;
    
    // 
    let fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fShader,fsString);
    gl.compileShader(fShader);
    let vShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vShader,vsString);
    gl.compileShader(vShader);
    if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS) 
            || !gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) {
        console.error("ARShader: could not compile shaders");
        return;
    }
    
    let shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram,vShader);
    gl.attachShader(shaderProgram,fShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error("ARShader: could not link shaders");
        return;
    }
    
    // end of shader initialization, the remaining part is shader use.

    let positionLocation = gl.getAttribLocation(program, "a_position");
    let textureLocation = gl.getUniformLocation(program, "u_texture");
    
    
    // Create a buffer.
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Put a unit quad in the buffer
    let positions = [
        0, 0,
        0, 1,
        1, 0,
        1, 0,
        0, 1,
        1, 1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);


    let createTexture = function(video) {
        let tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        // Fill the texture with a 1x1 blue pixel.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array([0, 0, 255, 255]));

        // let's assume all images are not a power of 2
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        let textureInfo = {
            width: video.width,   // we don't know the size until it loads
            height: video.height,
            texture: tex,
        };
        gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
        
        return tex;        
    }
    
    
    let renderVideo(tex) {
        gl.bindTexture(gl.TEXTURE_2D, tex);

        // Tell WebGL to use our shader program pair
        gl.useProgram(shaderProgram);

        // Setup the attributes to pull data from our buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // Tell the shader to get the texture from texture unit 0
        gl.uniform1i(textureLocation, 0);

        // draw the quad (2 triangles, 6 vertices)
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }    
    
}



// this method should be a method of XRSession
// time is a timestamp, frame is an XRFrame, callback has a frame
var FakeXRSession = function() {
    
    

    this.requestAnimationFrame = function(callback) {
        // step 1: draw image in the buffer
        // problem: buffer is usually not bound to viewer.
        
        
        // step 2: estimate pose and inject it in an XRFrame        
        
        
        // for the finishing touch, we call the myRequestAnimationFrame of navigator
        window.requestAnimationFrame()
    }
    
};


// pour bien faire, il faudrait surcharger requestAnimationFrame du navigateur pour caler son propre requestAnimationFrame.
/*
window.requestAnimationFrame = (function(_super) {
    return function() {
        // here we can override requestAnimationFrame
        
        return _super.apply(this, arguments);
    };
})(window.requestAnimationFrame);
*/

var FakeXRFrame = {
    session : null,
    getPose: function() {},
    getViewerPose: function() {}
};
    
