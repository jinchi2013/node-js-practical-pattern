"use strict";

const Writable = require('stream').Writable;
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

class ToFileStream extends Writable {

    constructor(options) {
        super(options);
    }

    _write (chunk, encoding, callback) {
        mkdirp(path.dirname(chunk.path), (err) => {
            if(err) {
                return callback(err);
            }
            fs.writeFile(chunk.path, chunk.content, callback);
        });
    }

}

module.exports = ToFileStream;