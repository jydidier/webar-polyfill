

let XRWebGLLayer = function(session, context, layerInit) {
    //let session 
    let currentContext;
    
    
    Object.defineProperty(this, "antialias", {
        value: true,
        writable: false
    });
    
    Object.defineProperty(this, "ignoreDepthValues", {
        value: false,
        writable: false        
    });
    
    Object.defineProperty(this,"framebuffer", {
        get: function() { return currentContext.getParameter(currentContext.FRAMEBUFFER_BINDING); }
    });
    
    Object.defineProperty(this, "framebufferWidth", {
        get: function() { return currentContext.drawingBufferWidth; }
    });
    
    Object.defineProperty(this, "framebufferHeight", {
        get: function() { return currentContext.drawingBufferHeight; }
    });
    

    // unofficial property ; it should not be used.
    Object.defineProperty(this,"context", {
        get: function() { return currentContext; }
    });
    

    this.getViewport = function() {
        return {
            x: 0, y: 0,   
            width: currentContext.drawingBufferWidth,
            height: currentContext.drawingBufferHeight
        };
        
    }
    
    currentContext = context;
};


// TODO just returning default specification value
XRWebGLLayer.getNativeFramebufferScaleFactor = function (session) {
    return 1.0;
};

export { XRWebGLLayer as default}; 
