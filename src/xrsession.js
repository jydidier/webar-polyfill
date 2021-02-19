import ARCompositor from './arcompositor.js';

let XRSession = function(params) {
    let self=this;
    
    //let environmentBlendMode; // not used in specification?
    let inputSources= [];
    let renderState = { depthNear:0.1, depthFar:1000.0, inlineVerticalFieldofView: null, baseLayer: null} ;
    let visibilityState;
    let ended = false;
    let compositor = new ARCompositor();
    
    
    /*Object.defineProperty(this,"environmentBlendMode", {
        get: function() { return environmentBlendMode; }
    });*/

    Object.defineProperty(this,"inputSources", {
        get: function() { return inputSources; }
    });
    
    Object.defineProperty(this,"renderState", {
        get: function() { return renderState; }
    });

    Object.defineProperty(this,"visibilityState", {
        get: function() { return visibilityState; }
    });
    
    this.cancelAnimationFrame = function(handle) {
        window.cancelAnimationFrame(handle);
    };
    
    this.end = function() {        
    };
    
    this.requestAnimationFrame = function(animationFrameCallback) {        
        // here we sould cook another callback in order to be compatible
        let sessionCallback = function() {
            
            animationFrameCallback(time, frame);
        };
        
        
        return window.requestAnimationFrame(sessionCallback);
    };
    
    this.requestReferenceSpace = function() {
    };
    
    this.updateRenderState = function(newState) {
        
    };
    
    let onend;
    let oninputsourceschange;
    let onselect;
    let onselectstart;
    let onselectend;
    let onsqueeze;
    let onsqueezestart;
    let onsqueezeend;
    let onvisibilitychange;    
};


XRSession.prototype = Object.create(EventTarget.prototype);
XRSession.prototype.constructor = XRSession;

export { XRSession as default}; 
