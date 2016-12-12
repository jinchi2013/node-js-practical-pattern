"use strict";
const Utils = require('./utils/utilities');
const TaskQueuePromise = require('./utils/taskQueue-promise');
const fs = require('fs');
const path = require('path');

const utils = new Utils();
const request = utils.promisify(require('request'));
const mkdirp = utils.promisify(require('mkdirp'));
const readFile = utils.promisify(fs.readFile);
const writeFile = utils.promisify(fs.writeFile);

let downloadQueue = new TaskQueuePromise(2);
function spiderLinks(currentUrl, body, nesting) {
    if(nesting === 0) {
        return Promise.resolve();
    }
    let links = utils.getPageLinks(currentUrl, body);
    /**
     * we need the following because the promise we create next will never
     * settle if there are no tasks to process
     * */
    if(links.length) {
        return Promise.resolve();
    }
    return new Promise((resolve, reject)=>{
        let completed = 0;
        links.forEach( (link) => {
            let task = ()=>{
                return spider(link, nesting - 1).then(
                    () => {
                        if(++completed === links.length) {
                            resolve();
                        }
                    }).catch(reject)
            };
            downloadQueue.pushTask.bind(downloadQueue, task);
        });
    });
}

function download (url, filename) {
    console.log(`Downloading ${url}`);
    let body;
    return request(url).then( (result) => {
        body = result[1];
        return mkdirp(path.dirname(filename));
    } ).then( () => {
        return writeFile(filename, body);
    }).then( () => {
        console.log(`Downloaded and saved: ${url}`);
        return body;
    } );
}

let spidering = {};
function spider(url, nesting) {
    if(spidering[url]) {
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

spider(process.argv[2], 1)
    .then( ()=>{
        console.log('Download complete');
    } )
    .catch( (err) => {
        console.log(err);
    } );