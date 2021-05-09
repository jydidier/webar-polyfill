let ARCompositor = function (ardevice) {
    // a set of local variables
    let glLayer = null;


    
    // creation of the actual compositing zone
    let canvas = document.createElement("canvas");
    canvas.width= window.innerWidth;
    canvas.height= window.innerHeight;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    
    
    //canvas.hidden = true;
    let gl = canvas.getContext("webgl");
    if (!gl) {
        console.error("Could not initialize WebGL context for ARCompositor");
        return ;
    }
    document.body.appendChild(canvas);

    // first, here are the two shaders we need.
    const vsString = `
        attribute vec2 a_position;
        varying vec2 v_texcoord;
        const mat4 c_matrix = mat4(
            2,0,0,0,
            0,-2,0,0,
            0,0,0,0,
            -1,1,1,1            
        );
        void main() {
            gl_Position = c_matrix * vec4(a_position,0,1);
            v_texcoord = a_position;
        }
    `;
    const fsString = `
        precision mediump float;
        varying vec2 v_texcoord;
        uniform sampler2D u_texture0;
        uniform sampler2D u_texture1;
        void main() {
            vec4 vidPx = texture2D(u_texture0, v_texcoord);
            vec4 vidGl = texture2D(u_texture1, v_texcoord);
            gl_FragColor = vidGl.a * vidGl + ((1.0-vidGl.a) * vidPx) ;
        }
    `;
    
    let fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fShader,fsString);
    gl.compileShader(fShader);
    let vShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vShader,vsString);
    gl.compileShader(vShader);
    if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS) 
            || !gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) {
        console.error("ARCompositor: could not compile shaders");
        gl.deleteShader(fShader);
        gl.deleteShader(vShader);
        return;
    }
    
    let shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram,vShader);
    gl.attachShader(shaderProgram,fShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error("ARCompositor: could not link shaders");
        return;
    }
    
    let positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
    let textureLocation0 = gl.getUniformLocation(shaderProgram, "u_texture0");
    let textureLocation1 = gl.getUniformLocation(shaderProgram, "u_texture1");
    
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    let positions = [
        0, 0,
        0, 1,
        1, 0,
        1, 0,
        0, 1,
        1, 1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.viewport(0,0,gl.canvas.width, gl.canvas.height);
    
    
    let texture0 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture0);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);    
    
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
              new Uint8Array([0, 0, 255, 255]));
    
    
    let texture1 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);    
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
              new Uint8Array([0, 0, 255, 255]));

    
    
    
    this.setGLLayer = function(layer) {
        glLayer = layer;
    };

    this.isActive = function() {
        //return true;
        return glLayer !== null;
    }
    

    this.render = function() {

        if (glLayer !== null) {
            //console.log("compositor render",glLayer);
            let origCanvas = glLayer.canvas;
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, texture1);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, origCanvas);
        }
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture0);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ardevice.getImager());        
        
        gl.useProgram(shaderProgram);
        

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        gl.uniform1i(textureLocation0, 0);
        gl.uniform1i(textureLocation1, 1);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.finish();
    };    
    

    
};

export {ARCompositor as default};

