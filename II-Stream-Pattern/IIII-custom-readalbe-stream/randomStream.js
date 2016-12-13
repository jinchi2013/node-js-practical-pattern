"use strict";

const Readable = require('stream').Readable;
const chance = require('chance').Chance();

class MyReadable extends Readable {
    constructor(options) {
        super(options);
    }

    _read (size) {
        let chunk = chance.string();
        console.log(`Pushing chunk of size: ${chunk.length}`);
        this.push(chunk, 'utf8');
        if(chance.bool({likelihood: 5})) {
            this.push(null);
        }
    }
}

module.exports = MyReadable;