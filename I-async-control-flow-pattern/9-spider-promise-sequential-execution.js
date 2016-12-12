/**
 * Created by 9cjin on 11/29/16.
 */
"use strict";
const path = require('path');
const fs = require('fs');
const Utils = require('./utils/utilities');

let utils = new Utils();
let request = utils.promisify(require('request'));
let mkdirp = utils.promisify(require('mkdirp'));
let readFile = utils.promisify(fs.readFile);
let writeFile = utils.promisify(fs.writeFile);

/**
 * let tasks = [...]; //tasks function array
 * let promise = tasks.reduce( (prev, task)=> {
 *      return prev.then( () =>{
 *          return task();
 *      });
 * }, Promise.resolve());
 * promise.then( ()=>{
 *      // All tasks completed
 * } );
 *
 * */

function spiderLinks(currentUrl, body, nesting) {
    let promise = Promise.resolve();

    if(nesting === 0) {
        return promise;
    }
    let links = utils.getPageLinks(currentUrl, body);
    links.forEach((link)=>{
        promise = promise.then(()=>{
            return spider(link, nesting - 1);
        });
    });
    return promise;
}

function download(url, filename) {
    console.log(`Downloading ${url}`);
    let body;
    return request(url).then((results)=>{
        body = results[1];
        return mkdirp(path.dirname(filename));
    }).then(()=>{
        return writeFile(filename, body);
    }).then(()=>{
        console.log(`Downloaded and saved: ${url}`);
        return body;
    });
}

function spider(url, nesting) {
    let filename = utils.filename(url);
    return readFile(filename, 'utf8').then(
        (body)=>{
            return spiderLinks(url, body, nesting);
        },
        (err) => {
            if(err !== 'ENOENT') {
                throw err;
            }
            return download(url, filename).then((body)=>{
                return spiderLinks(url, body, nesting);
            });
        }
    );
}

spider(process.argv[2], 1).then(()=>{
    console.log('Download Complete!');
}).catch((err)=>{
    console.log(err);
})