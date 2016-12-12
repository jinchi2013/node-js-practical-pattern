"use strict";
/**
 * This example is for flowing mode of a stream.readable
 * process.stdin is a readable stream
 * */
process
    .stdin.setEncoding('utf8') // this will set encoding to utf8 or it would be binary data
    .on('data', (chunk)=>{
        console.log('New data available');
        console.log(
            `Chunk read: (size: ${chunk.length}) ${chunk.toString()}`
        );
    })
    .on('end', ()=>{
        process.stdout.write('End of stream!!! \n');
    });
