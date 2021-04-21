const path = require('path');

module.exports = {
    entry: './src/xrsystem.js',
    mode: 'production',
    output: {
        filename: 'webar-polyfill.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
