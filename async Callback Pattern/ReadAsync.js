'use strict';
const fs =require('fs');
const cache = {};
function consistentReadAsync(filename, callback) {
    if( cache[filename] ) {
        /**
         * this will defers the execution of a function until the next pass of the event loop.
         * it takes a callback as an argument and pushes it on the top of the event queue,
         * in front of any pending I/O event
         * */
        process.nextTick(()=>{
            callback(cache[filename]);
        });
    } else {
        //asynchronous function
        fs.readFile(filename, 'utf8', (err, data)=>{
            cache[filename] = data;
            callback(data);
        });
    }
}

function readJSONThrows(filename, callback) {
    fs.readFile(filename, 'utf8', (err, data)=>{
        if(err){
            return callback(err);
        } else {
            callback(null, JSON.parse(data));
        }
    });
}

readJSONThrows('foo.txt', (err)=>{
    console.log(err);
});

process.on('uncaughtException', (err)=>{
    console.log(`This will catch at last the JSON parsing exception: ${err.message}`);

    // without this, the application would continue
    process.exit(1);
});

consistentReadAsync('foo.txt', (data)=>{
    console.log(data);
});

