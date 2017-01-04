'use strict';

const combine = require('multipipe');
const fs = require('fs');
const decryptAndDecompressStream = require('./combinedStream');

combine(
    fs.createReadStream(process.argv[3]),
    decryptAndDecompressStream(process.argv[2]),
    fs.createWriteStream(process.argv[3].replace(/\.gz\.aes$/))
).on('error', (err)=>{
    console.log(err);
});
