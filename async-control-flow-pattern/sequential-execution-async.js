/**
 * Created by CalvinJ on 11/27/2016.
 */
"use strict";

/**
 * Executing a set of known tasks in sequence, without chaining or propagating results
 * Using the output of a task as the input for the next(also known as chain, pipeline, waterfall)
 * Iterating over a collection while running an asynchronous task on each element, one after the other
 * */

const request = require('request');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const Utils = require('./utils/utilities');
let utils = new Utils();

function spiderLinks(currentUrl, body, nesting, callback) {
    if( nesting === 0 ) {
        // use .nextTick() to defer the callback until next event
        return process.nextTick(callback);
    }

    let links = utils.getPageLinks(currentUrl, body);

    function iterate(index) {
        if(index === links.length) {
            return callback();
        }

        spider (links[index], nesting - 1, (err)=>{
            if(err){
                return callback(err);
            }
            iterate(index + 1);
        });
    }
    iterate(0);
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
