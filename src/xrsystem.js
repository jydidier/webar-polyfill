import XRSession from './xrsession.js';
import ARDevice from './ardevice.js';
import XRWebGLLayer from './xrwebgllayer.js';

let XRSystem = function() {
    let device;
    
    this.isSessionSupported = async function(sessionMode) {
        if (sessionMode === "immersive-ar" || sessionMode === "inline")
            return true;
        else 
            throw false;
    };
    
    this.requestSession = async function(sessionMode, sessionInit) {
        if (sessionMode !== "immersive-ar" && sessionMode !== "inline")
            throw false;

        device = new ARDevice();
        
        await device.start();
        
        return new XRSession(device, sessionInit);
    };
};

XRSystem.prototype = Object.create(EventTarget.prototype);
XRSystem.prototype.constructor = XRSystem;



let xrSystem = new XRSystem();

navigator.xr.isSessionSupported = xrSystem.isSessionSupported;
navigator.xr.requestSession = xrSystem.requestSession;
window.XRWebGLLayer = XRWebGLLayer;
