"use strict";
const request = require('request');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const Utils = require('./utils/utilities');
const async = require('async');

let utils = new Utils();

function spiderLinks(currentUrl, body, nesting, callback) {
    if(nesting === 0) {
        return process.nextTick(callback);
    }
    let links = utils.getPageLinks(currentUrl, body);
    if(links.length === 0) {
        return process.nextTick(callback);
    }

    // async each function will loop through each task in the array, no order
    async.each(links, (link, callback)=>{
        spider(link, nesting - 1, callback);
    }, callback);
}

function download(url, filename, callback) {
    console.log(`Download ${url}`);
    let body;

    async.series(
        [
            (callback)=>{
                request(url, (err, response, resBody)=>{
                    if(err){
                        return callback(err);
                    }
                    body = resBody;
                    callback();
                })
            },
            mkdirp.bind(null, path.dirname(filename)),
            (callback)=>{
                fs.writeFile(filename, body, callback);
            }
        ],
        (err) => {
            console.log(`Downloaded and saved: ${url}`);
            if(err) {
                return callback(err);
            }
            callback(null, body);
        }
    );
}

var spidering = {};
function spider(url, nesting, callback) {
    if(spidering[url]) {
        return process.nextTick(callback);
    }
    spidering[url] = true;

    let filename = utils.filename(url);
    fs.readFile(filename, 'utf8', (err, body)=>{
        if(err) {
            if(err !== 'ENOENT') {
                return  callback(err);
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
    if(err){
        console.log(err);
    } else {
        console.log(`Download complete ${filename}`);
    }
});