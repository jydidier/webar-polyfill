

let XRWebGLLayer = function(session, context, layerInit) {
    //let session 
    let currentContext;
    let framebuffer = null;
    let width = 0;
    let height = 0;
    
    
    Object.defineProperty(this, "antialias", {
        value: true,
        writable: false
    });
    
    Object.defineProperty(this, "ignoreDepthValues", {
        value: false,
        writable: false        
    });
    
    Object.defineProperty(this,"framebuffer", {
        get: function() { return framebuffer; /*return currentContext.getParameter(currentContext.FRAMEBUFFER_BINDING); */}
    });
    
    Object.defineProperty(this, "framebufferWidth", {
        get: function() { return width; /*return currentContext.drawingBufferWidth;*/ }
    });
    
    Object.defineProperty(this, "framebufferHeight", {
        get: function() { return height; /*return currentContext.drawingBufferHeight;*/ }
    });
    

    // unofficial property ; it should not be used.
    Object.defineProperty(this,"context", {
        get: function() { return currentContext; }
    });
    

    this.getViewport = function() {
        return {
            x: 0, y: 0,   
            width: width, /*currentContext.drawingBufferWidth,*/
            height: height /*currentContext.drawingBufferHeight*/
        };
        
    }
    
    currentContext = context;
    
    framebuffer = currentContext.getParameter(currentContext.FRAMEBUFFER_BINDING);
    width = currentContext.drawingBufferWidth;
    height = currentContext.drawingBufferHeight;
};


// TODO just returning default specification value
XRWebGLLayer.getNativeFramebufferScaleFactor = function (session) {
    return 1.0;
};

export { XRWebGLLayer as default}; 
