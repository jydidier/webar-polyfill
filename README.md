# webar-polyfill
As reduced as possible polyfill in order to use and test webxr features on recent desktop web browsers.

The code of this polyfill is using [js-aruco](https://github.com/jcmellado/js-aruco) which is a port to 
javascript of the ArUco library and is used as a mean to compute pose of our fake web AR device.
Its licence is included inside this repository.

## Development environment setup

This polyfill uses [webpack](https://webpack.js.org/) in order to produce
the final version of this polyfill.

## WebXR specification implementation

This implementation of the [WebXR specification](https://www.w3.org/TR/webxr/)
is not 100% compliant with the original document. The idea is to rather give a 
subset of the proposed features.

