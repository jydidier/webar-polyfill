import * as XRSession from './xrsession.js';

let XRSystem = function() {

    this.isSessionSupported = function(xrSessionMode) {
        // TODO reject in case a webcam is not operational
        return new Promise((resolve,reject) =>  {
                resolve(mode === "immersive-ar");            
            });
    };
    
    this.requestSession = function(sessionMode, sessionInit) {
        return new Promise((resolve, reject) => {
            if (sessionMode === "immersive-ar")
                resolve(new XRSession(sessionInit));
            else 
                reject();            
        });
    };
};
