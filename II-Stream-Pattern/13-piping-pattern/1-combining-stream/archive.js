"use strict";

const combine = require('multipipe');
const fs = require('fs');
const compressAndEncryptStream = require('./combinedStream');

combine(
    fs.createReadStream(process.argv[3]),
    compressAndEncryptStream(process.argv[2]),
    fs.createWriteStream(`${process.argv[3]}.gz.aes`)
).on('error', (err)=>{
    //This error may come from any stream in the pipeline
    console.log(err);
});
