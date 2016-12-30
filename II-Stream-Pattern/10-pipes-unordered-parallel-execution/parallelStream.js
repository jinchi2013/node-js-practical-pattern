"use strict";
const stream = require('stream');

class ParallelStream extends stream.Transform {
    constructor (userTransform) {
        super({objectMode: true});
        this.userTransform = userTransform;
        this.running = 0;
        this.terminateCallback = null;
    }

    _transform (chunk, enc, done) {
        this.running++;
        this.userTransform(chunk, enc, this._onComplete.bind(this));
        done();
    }

    _onComplete (err, chunk) {
        this.running--;
        if(err) {
            return this.emit('error', err);
        }

        if(this.running === 0) {
            this.terminateCallback && this.terminateCallback();
        }
    }

    _flush (done) {
        if(this.running > 0) {
            this.terminateCallback = done;
        } else {
            done();
        }
    }
}

module.exports = ParallelStream;
