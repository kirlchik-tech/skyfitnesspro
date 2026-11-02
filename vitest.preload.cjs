const zlib = require('node:zlib');
const nodeModule = require('node:module');

// Поддержка старых версий Node.js (Node 18/20), где нет createZstdDecompress для undici
if (typeof zlib.createZstdDecompress !== 'function') {
    zlib.createZstdDecompress = zlib.createGunzip;
}

if (typeof zlib.createBrotliDecompress !== 'function') {
    zlib.createBrotliDecompress = zlib.createGunzip;
}

if (typeof nodeModule.syncBuiltinESMExports === 'function') {
    nodeModule.syncBuiltinESMExports();
}