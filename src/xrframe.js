import XRPose from './xrpose.js';
import XRView from './xrview.js';
import XRViewerPose from './xrviewerpose.js';

let XRFrame = function(xrSession,xrDevice) {
    let session = xrSession;
    
    Object.defineProperty(this,"session", {
        get: function() { return session; }
    });
    
    this.getViewerPose = function(referenceSpace) {
        // TODO check things about spaces
        
        //console.log(referenceSpace);
        return new XRViewerPose( xrDevice.getProjection(), xrDevice.getTransform());
    };
    
    this.getPose = function(space, baseSpace) {
        // TODO check things about spaces
        return xrDevice.getTransform();
    };

    xrDevice.fetchFrame();
    
};

export { XRFrame as default};
