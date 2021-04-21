
let XRView = function(projMat,tr) {
    let projectionMatrix = projMat;
    let transform = tr;
    
    Object.defineProperty(this,"eye", {
        value: "none", writable: false
    });

    Object.defineProperty(this,"projectionMatrix", {
        get: function() { return projectionMatrix;}
    });
    
    Object.defineProperty(this,"transform", {
        get: function() { return transform;}
    });
    
        
};

export {XRView as default};

