"use strict";

const zlib = require('zlib');
const crypto = require('crypto');
const combine = require('multipipe');
const fs = require('fs');

// A better Stream#pipe that creates duplex streams and lets you handle errors in one place.

module.export.compressAndEncrypt = function(password) {
    return combine(
        zlib.createGzip(),
        crypto.createCipher('aes192', password)
    );
};

module.export.decryptAndDecompress = function(password) {
    return combine(
        crypto.createDecipher('aes192', password),
        zlib.createGunzip()
    );
};