import XRPose from './xrpose.js';
import XRView from './xrview.js';

let XRViewerPose = function()  {
    let views = function() {        
        // TODO define projmat, transform
        return new XRView(projmat, transform);
    };

    
    Object.defineProperty(this,"views", {
        get: views
    });

};

XRViewerPose.prototype = Object.create(XRPose.prototype);
XRViewerPose.prototype.constructor = XRPose;


export {XRViewerPose as default};
