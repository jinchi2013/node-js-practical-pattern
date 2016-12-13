"use strict";
const RandomStream = require('./randomStream');
let randomStream = new RandomStream();

randomStream.on('readable', () => {
    let chunk;
    while( (chunk = randomStream.read()) !== null ) {
        console.log(`Chunk received: ${chunk.toString()}`);
    }
});
