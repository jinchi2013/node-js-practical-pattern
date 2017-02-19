/**
 * we created a factory that returns a proxied version of the writable object passed as an argument.
 * we provide an override for the write() method that logs a message to the standard output every time
 * it is invoked and every time the async opertion completes.
 *
 * */

function createLoggingWritable(writableOrig) {
    "use strict";
    let proto = Object.getPrototypeOf(writableOrig);
    function LoggingWritable(subject) {
        this.writableOrig = subject;
    }

    LoggingWritable.prototype = Object.create(proto);

    LoggingWritable.prototype.write =
        function(chunk, encoding, callback) {
            if(!callback && typeof encoding === 'function') {
                callback = encoding;
                encoding = undefined;
            }
            console.log(`Writing ${chunk}`);

            /**
             * this is also a good example to demonstrate the particular case of creating proxies of
             * async functions, which makes necessary to proxy the callback as well.
             * */

            return this.writableOrig.write(chunk, encoding, function(){
                console.log(`Finished writing ${chunk}`);
                callback && callback();
            });
        };
    /**
     * the on() and end() methods
     * are simply delegated to the original writable stream
     * */
    LoggingWritable.prototype.on =
        function() {
            return this.writableOrig.on
                .apply(this.writableOrig, arguments);
        };

    LoggingWritable.prototype.end =
        function() {
            return this.writableOrig.end
                .apply(this.writableOrig, arguments);
        };

    return new LoggingWritable(writableOrig);
}

const fs = require('fs');
const writable = fs.createWriteStream('test.txt');
const writableProxy = createLoggingWritable(writable);
writableProxy.write('First chunk \n');
writableProxy.write('Second chunk \n');
writable.write('This is not logged \n');
writableProxy.end();