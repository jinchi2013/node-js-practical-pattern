/**
 * Created by 9cjin on 11/29/16.
 */
const request = require('request');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const Utils = require('./utils/utilities');
const async = require('async');

let utils = new Utils();

/**
 * Creates a queue object with the specified concurrency.
 * Tasks added to the queue are processed in parallel (up to the concurrency limit).
 * If all workers are in progress, the task is queued until one becomes available.
 * Once a worker completes a task, that task's callback is called.
 * */
let downloadQueue = async.queue((taskData, callback)=>{
    spider(taskData.link, taskData.nesting - 1, callback );
}, 2);

function spiderLinks(currentUrl, body, nesting, callback) {
    if(nesting === 0) {
        return process.nextTick(callback);
    }
    var links = utils.getPageLinks(currentUrl, body);
    if(links.length === 0) {
        return process.nextTick(callback);
    }
    let completed = 0, errored= false;
    links.forEach((link)=>{
        let taskData = {
            link: link,
            nesting: nesting
        };

        downloadQueue.push(taskData, (err)=>{
            if(err) {
                errored = true;
                return callback(err);
            }
            if(++completed === links.length && !errored) {
                callback();
            }
        });
    });
}

function download(url, filename, callback) {
    console.log(`Downloading ${url}`);
    let body;

    async.series(
        [
            (callback)=>{
                request(url, (err, response, resBody)=>{
                    if(err) {
                        return callback(err);
                    }
                    body = resBody;
                    callback();
                });
            },
            mkdirp.bind(null, path.dirname(filename)),
            (callback)=>{
                fs.writeFile(filename, body, callback);
            }
        ], (err)=>{
            console.log(`Downloaded and saved: ${url}`);
            if(err) {
                return callback(err);
            }
            callback(null, body);
        }
    )
}

let spidering = {};
function spider(url, nesting, callback) {
    if(spidering[url]){
        return process.nextTick(callback);
    }
    spidering[url] = true;

    let filename = utils.filename(url);
    fs.readFile(filename, 'utf8', (err, body)=>{
        if(err) {
            if(err.code !== "ENOENT") {
                return callback(err);
            }

            return download(url, filename, (err, body)=>{
                if(err) {
                    return callback(err);
                }
                spiderLinks(url, body, nesting, callback);
            });
        }

        spiderLinks(url, body, nesting, callback);
    });
}

spider(process.argv[2], 1, (err, filename)=>{
    if(err) {
        console.log(err);
    } else {
        console.log(`Download complete ${filename}`);
    }
});