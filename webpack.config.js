const path = require('path');

module.exports = {
    entry: './src/xrsystem.js',
    output: {
        filename: 'webar-polyfill.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
