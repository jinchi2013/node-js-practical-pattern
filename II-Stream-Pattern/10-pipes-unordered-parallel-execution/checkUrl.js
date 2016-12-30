"use strict";
const fs = require('fs');
const split = require('split');
const request = require('request');
const ParallelStream = require('./parallelStream');

fs.createReadStream(process.argv[2])
    .pipe(split())
    .pipe(new ParallelStream(function(url, enc, done) {
        if(!url) {
            return done();
        }
        request.head(url, (err, response) => {
            this.push(`${url} is ( ${err ? 'down' : 'up'} ) \n`);
            done();
        })
    }))
    .pipe(fs.createWriteStream('results.txt'))
    .on('finish', ()=>{
        console.log('All urls were checked');
    });