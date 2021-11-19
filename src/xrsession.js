import ARCompositor from './arcompositor.js';
import XRFrame from './xrframe.js';

let XRSession = function(device, params) {
    let self=this;
    let refTime = Date.now();
    
    //let environmentBlendMode; // not used in specification?
    let inputSources= [];
    let renderState = { depthNear:0.1, depthFar:1000.0, inlineVerticalFieldofView: null, baseLayer: null} ;
    let visibilityState;
    let ended = false;
    let compositor = new ARCompositor(device);
    let callbacks = [];
    let frameCount = 0;
    
    
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
    
    
    let renderFrame = function(event) {
        let frame = new XRFrame(this, device);        
        let callback = null; 
        let callbackNumber = callbacks.length;
        
        for (let i=0; i < callbackNumber; i++) {
            callback = callbacks.shift();
            callback(Date.now() - refTime, frame);  
        } 
        if (compositor.isActive()) {
            compositor.render();
        }
        device.setRenderCallback(renderFrame);

    }

    
    device.setRenderCallback(renderFrame);
    
    this.requestAnimationFrame = function(animationFrameCallback) {
        frameCount++;
        callbacks.push(animationFrameCallback);
        return frameCount;
    };

        // here we sould cook another callback in order to be compatible
        /*let sessionCallback = function() {
            console.log('sessionCallback');
            animationFrameCallback(Date.now() - refTime, new XRFrame(this, device));
            if (compositor.isActive()) {
                compositor.updateVideo();
                compositor.render();
            }
        };*/
        //return window.requestAnimationFrame(sessionCallback);
        /*console.log('device time updated', device.isTimeUpdated());
        if (device.isTimeUpdated()) {
            let callback = callbacks.shift();
            if (callback !== undefined) {
                console.log('sessionCallback');                
                callback(Date.now() - refTime, new XRFrame(this, device));
                if (compositor.isActive()) {
                    compositor.updateVideo();
                    compositor.render();
                }
                
                
            }
        }*/
        //return window.requestAnimationFrame(sessionCallback);
    
    this.requestReferenceSpace = function() {
    };
    
    this.updateRenderState = function(newState) {
        // TODO let's cook the render state given here.
        if (newState.hasOwnProperty("baseLayer") && newState.baseLayer !== null) {
            compositor.setGLLayer(newState.baseLayer.context);
        }
        
        for (let s in newState) {
            if (newState.hasOwnProperty(s)) {
                renderState[s] = newState[s];
            }
            
        }
        
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



    // another way of doing it 
    let listeners = {};
    this.addEventListener = function (type, callback) {
        if (!(type in listeners)) {
            listeners[type] = []
        }
        listeners[type].push(callback)
    };
    
    this.removeEventListener = function (type, callback) {
        if (!(type in listeners)) {
            return
        }
        const stack = listeners[type]
        for (let i = 0, l = stack.length; i < l; i++) {
            if (stack[i] === callback) {
                stack.splice(i, 1)
            return
        }
    };
    
    this.dispatchEvent = function (event) {
        if (!(event.type in listeners)) {
            return true
        }
        const stack = listeners[event.type].slice()

        for (let i = 0, l = stack.length; i < l; i++) {
            stack[i].call(this, event)
        }
        return !event.defaultPrevented
    };
    
    
}
    
    
    
    
};


XRSession.prototype = Object.create(EventTarget.prototype);
XRSession.prototype.constructor = XRSession;

export { XRSession as default}; 
