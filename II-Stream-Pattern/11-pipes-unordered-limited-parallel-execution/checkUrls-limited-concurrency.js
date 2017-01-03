"use strict";

const fs = require('fs');
const split = require('split');
const request = require('request');
const limitedParallelStream = require('./limitedParallelStream');

fs.createReadStream(process.argv[2])
    .pipe(split())
    .pipe(limitedParallelStream(2, function(url, enc, done){
        if(!url) {
            return done();
        }
        request.head.call(limitedParallelStream, url, (err, response)=>{
            this.push(`${url} is ( ${err ? 'down' : 'up'} ) \n`);
            done();
        });
    }))
    .pipe(fs.createWriteStream('results.txt'))
    .on('finish', ()=>{
        console.log('All urls were checked!');
    });
