"use strict";

const fromArray = require('from2-array');
const through = require('through2');
const fs = require('fs');

function concatFiles(destination, files, callback) {
    let destStream = fs.createWriteStream(destination);

    console.log('start of Piping');
    fromArray.obj(files)
        .pipe(through.obj((file, enc, done)=>{
            let src = fs.createReadStream(file);
            console.log(`File name ${file}`);
            src.pipe(destStream, {end: false});
            src.on('end', ()=>{
                done();
            })
        }))
        .on('finish', ()=>{
            destStream.end();
            callback();
        });

    console.log('end of Piping');
}

module.exports = concatFiles;