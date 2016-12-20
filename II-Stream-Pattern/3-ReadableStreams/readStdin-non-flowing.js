"use strict";
/**
 * This example is for non-flowing mode of a stream.readable
 * process.stdin is a readable stream
 * */
process
    .stdin.setEncoding('utf8') // this will set encoding to utf8 or it would be binary data
    .on('readable', ()=>{
    let chunk;
    console.log('New data Available');
    // process.stdin.read() will directly read data from stream
    while((chunk = process.stdin.read()) !== null) {
        console.log(
            `Chunk read: (${chunk.length}), ${chunk.toString()}`
        );
    }
    })
    .on('end', ()=>{
        process.stdout.write('End of Stream!!! \n');
    });
