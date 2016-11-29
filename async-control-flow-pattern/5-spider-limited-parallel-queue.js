/**
 * Created by CalvinJ on 11/28/2016.
 */
"use strict";

const request = require('request');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const Utils = require('./utils/utilities');
const TaskQueue = require('./utils/taskQueue');

let utils = new Utils();
let downloadQueue = new TaskQueue(2);

function spiderLinks(currentUrl, body, nesting, callback) {
    if(nesting === 0 ) {
        return process.nextTick(callback);
    }

    let links = utils.getPageLinks(currentUrl, body);

    if(links.length === 0) {
        return process.nextTick(callback);
    }

    let completed =0, errored = false;
    links.forEach((link)=>{
        downloadQueue.pushTask(
            // push below function into taskQueue
            // done is a callback to execute later
            (done)=>{
                spider(link, nesting - 1, (err)=>{
                    if(err) {
                        errored = true;
                        return callback(err);
                    }
                    if(++completed === links.length && !errored) {
                        callback();
                    }
                    done();
                })
            }
        );
    });
}

function saveFile(filename, contents, callback) {
    mkdirp(path.dirname(filename), (err)=>{
        if(err) {
            return callback(err);
        }
        fs.writeFile(filename, contents, callback);
    });
}

function download(url, filename, callback) {
    console.log('Downloading ' + url);
    request(url, function(err, response, body) {
        if(err) {
            return callback(err);
        }
        saveFile(filename, body, function(err) {
            console.log('Downloaded and saved: ' + url);
            if(err) {
                return callback(err);
            }
            callback(null, body);
        });
    });
}

let spidering = {};
function spider(url, nesting, callback) {
    if(spidering[url]) {
        return process.nextTick(callback);
    }
    spidering[url] = true;

    let filename = utils.filename(url);
    fs.readFile(filename, 'utf8', function(err, body) {
        if(err) {
            if(err.code !== 'ENOENT') {
                return callback(err);
            }

            return download(url, filename, function(err, body) {
                if(err) {
                    return callback(err);
                }
                spiderLinks(url, body, nesting, callback);
            });
        }

        spiderLinks(url, body, nesting, callback);
    });
}

spider(process.argv[2], 1, function(err, filename) {
    if(err) {
        console.log(err);
        process.exit();
    } else {
        console.log(`Download complete ${filename}`);
    }
});
