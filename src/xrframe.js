import XRPose from './xrpose.js';
import XRViewerPose from './xrviewerpose.js';

let XRFrame = function(xrSession,xrDevice) {
    let session = xrSession;
    
    Object.defineProperty(this,"session", {
        get: function() { return session; }
    });
    
    this.getViewerPose = function(referenceSpace) {
        // TODO check things about spaces
        return new XRView(xrDevice.getProjection(), xrDevice.getTransform());
    };
    
    this.getPose = function(space, baseSpace) {
        // TODO check things about spaces
        return xrDevice.getTransform();
    };

};

export { XRFrame as default};
