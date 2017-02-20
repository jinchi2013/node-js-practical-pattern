/**
 * Created by CalvinJ on 11/21/2016.
 */
const request = require('request');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const Utils = require('./utils/utilities');
let utils = new Utils();

/**
 * Callback issue
 * */

function spider(url, callback) {
    let filename = utils.filename(url);
    fs.exists(filename, function(exists) {
        if(!exists) {
            console.log("Downloading " + url);
            request(url, function(err, response, body) {
                if(err) {
                    callback(err);
                } else {
                    mkdirp(path.dirname(filename), function(err) {
                        if(err) {
                            callback(err);
                        } else {
                            fs.writeFile(filename, body, function(err) {
                                if(err) {
                                    callback(err);
                                } else {
                                    callback(null, filename, true);
                                }
                            });
                        }
                    });
                }
            });
        } else {
            callback(null, filename, false);
        }
    });
}


spider(process.argv[2], function(err, filename, downloaded) {
    if(err) {
        console.log(err);
    } else if(downloaded){
        console.log('Completed the download of "'+ filename +'"');
    } else {
        console.log('"'+ filename +'" was already downloaded');
    }
});