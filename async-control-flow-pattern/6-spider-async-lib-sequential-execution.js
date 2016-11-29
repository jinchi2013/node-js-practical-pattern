"use strict";

const request = require('request');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const Utils = require('./utils/utilities');
const async = require('async');

const utils = new Utils();

function spiderLinks (currentUrl, body, nesting, callback) {
	if(nesting === 0) {
		return process.nextTick(callback);
	}

	let links = utils.getPageLinks(currentUrl, body);
	if(links.length === 0) {
		return process.nextTick(callback);
	}

	// async eachSeries method will run only one single async operation at a time
	async.eachSeries(links, function(link, callback) {
		spider(link, nesting - 1, callback);
	}, callback);
}

function download(url, filename, callback) {
	console.log(`Download ${url}`);
	let body;

	// async series([task array], callback) will loop through the tasks array, to execute the task 
	// Only one for each time.  
	async.series([
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
		console.log(`Download and saved: ${url}`);
		if(err) {
			return callback(err);
		}
		callback(null, body)
	})
}

function spider(url, nesting, callback) {
	let filename = uitls.filename(url);
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

spider(process.argv[2], 1, (err, filename)=>{
	if (err) {
		console.log(err);
	} else {
		console.log(`Download complete ${filename}`);
	}
});



