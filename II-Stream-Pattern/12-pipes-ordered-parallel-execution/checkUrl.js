"use strict";

const fs = require('fs');
const split = require('split');
const request = require('request');
const throughParallel = require('through2-parallel');
/**
 * Creates a through stream (Transform stream) which executes in parallel while maintaining the order of the emitted chunks.
 *
 *  Please compare with the 9-pipes-sequential-execution concatFile.js
 *  which use through2 module to implement sequential execution
 * */

fs.createReadStream(process.argv[2])
    .pipe(split())
    .pipe(throughParallel.obj(2, function(url, enc, done){
        if(!url) return done();

        request.head.call(this, url, (err, response)=>{
            this.push(`${url} is ( ${err ? 'down' : 'up'} ) \n`);
            done();
        });
    }))
    .pipe(fs.createWriteStream('results.txt'))
    .on('finish', () => {
        console.log('All urls were checked!');
    });