/**
 * Created by 9cjin on 12/1/16.
 */
"use strict";
const path = require('path');
const Utils = require('./utils/utilities');
const fs = require('fs');

const utils = new Utils();
const request = utils.promisify(require('request'));
const mkdirp = utils.promisify(require('mkdirp'));
const readFile = utils.promisify(require(fs.readFile));
const writeFile = utils.promisify(require(fs.writeFile));

function spiderLinks(currentUrl, body, nesting) {
    if (nesting === 0) {
        // insteal of resolve each time the loop arrive spiderLinks in sequential execution pattern
        // only resolve when nesting === 0
       return Promise.resolve();
    }

    let links = utils.getPageLinks(currentUrl, body);
    let promises = links.map((link) => {
        return spider(link, nesting - 1);
    });

    return Promise.all(promises);
}

function download(url, filename) {
    console.log(`Downloading ${url}`);
    let body;
    return request(url).then( (result)=>{
        body = result[1];
        return mkdirp(path.dirname(filename));
    }).then( () => {
        return writeFile(filename, body);
    }).then( () => {
        console.log(`Downloaded and saved: ${url}`);
        return body;
    });
}

let spidering = {};
function spider(url, nesting) {
    if (spidering[url]) {
        return Promise.resolve();
    }
    spidering[url] = true;

    let filename = utils.filename(url);
    return readFile(filename, 'utf8').then(
        (body) => {
            return spiderLinks(url, body, nesting);
        },
        (err) => {
            if(err.code !== 'ENOENT') {
                throw err;
            }
            return download(url, filename).then(
                (body) => {
                    return spiderLinks(url, body, nesting);
                }
            );
        }
    );
}

spider(process.argv[2], 1).then(
    () => {
        console.log('Download complete');
    }
).catch(
    (err) => {
        console.log(err);
    }
);
