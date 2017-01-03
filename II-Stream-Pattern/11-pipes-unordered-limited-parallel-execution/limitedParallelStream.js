"use strict";

const stream = require('stream');

class LimitedParallelStream extends stream.Transform {
    constructor (concurrency, userTransform) {
        super({objectMode: true});
        this.running = 0;
        this.continueCallback = null;
        this.terminateCallback = null;
        this.userTransform = userTransform;
        this.concurrency = concurrency;
    }

    _transform (chunk, encode, done) {
        this.running++;
        this.userTransform(chunk, encode, this._onComplete.bind(this));
        if(this.running < this.concurrency) {
            done();
        } else {
            this.continueCallback = done;
        }
    }

    _onComplete (err, chunk) {
        this.running--;
        if(err) {
            return this.emit('error', err);
        }

        let tmpCallback = this.continueCallback;
        this.continueCallback = null;
        tmpCallback && tmpCallback();
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

module.exports = function(concurrency, transform) {
    return new LimitedParallelStream(concurrency, transform);
};