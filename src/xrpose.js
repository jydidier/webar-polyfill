
let XRPose = function(xrTransform, bEmulatedPosition) {
    let transform = xrTransform;
    let emulatedPosition = bEmulatedPosition;
    
    Object.defineProperty(this,"transform", {
        get: function() { return transform; }
    });
    
    Object.defineProperty(this,"emulatedPosition", {
        get: function() { return emulatedPosition; }
    });        
};

export {XRPose as default};
