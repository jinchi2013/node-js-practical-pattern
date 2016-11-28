/**
 * Created by 9cjin on 11/28/16.
 */

/**
 *  In case we don't care the sequence of the aync processes, we just want to be notiifed when all the processes is done
 * */
"use strict";
const request = require('request');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const Utils = require('./utils/utilities');
let utils = new Utils();


function spiderLinks(currentUrl, body, nesting, callback) {
    if( nesting === 0) {
        return process.nextTick(callback);
    }

    let links = utils.getPageLinks(currentUrl, body);
    if ( links.length === 0 ) {
        return process.nextTick(callback);
    }

    let completed = 0, errored = false;

    function done(err) {
        // if any err, use callback to return the err
        if(err) {
            errored = true;
            return callback(err);
        }
        // when the count of completed is equal to the length of links array
        // which means all the task are done.
        if(++completed === links.length && !errored) {
            return callback();
        }
    }

    links.forEach((link)=>{
        // call the callback when all aync process are done;
        spider(link, nesting -1, done);
    });
}

function saveFile(filename, contents, callback) {
    mkdirp(path.dirname(filename), (err)=> {
        if(err) {
            return callback(err);
        }
    });
    fs.writeFile(filename, contents, callback);
}

function download(url, filename, callback) {
    console.log(`Downloading ${url}`);
    request(url, (err, response, body)=>{
        if(err) {
            return callback(err);
        }
        saveFile(filename, body, (err)=>{
            console.log(`Downloaded and saved: ${url}`);
            if(err) {
                return callback(err);
            }
            callback(null, body);
        });
    })
}

function spider(url, nesting, callback) {
    let filename = utils.filename(url);
    fs.readFile(filename, 'utf8', (err, body)=>{
        if(err) {
            if(err.code !== 'ENOENT') {
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

spider(process.argv[2], 1, (err, filename)=> {
    if(err) {
        console.log(err);
    } else {
        console.log(`Download ${filename} complete`);
    }
});
