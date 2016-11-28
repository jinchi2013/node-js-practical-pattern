/**
	observable object pattern 	
*/

"use strict";

const fs = require('fs');
const EventEmitter = require('events');
const util = require('util');

class FindPattern extends EventEmitter {
	constructor (regex, files) {
		super();
		this.regex = regex;
		this.files = files || [];
	}

	addFile (file) {
		this.files.push(file);
		return this;
	}

	find () {
		this.files.forEach( (file) => {
			fs.readFile( file, 'utf8', (err, content)=>{
				if(err){
					this.emit('error', err);
				}

				this.emit('fileread', file);
				let match = content.match(this.regex);
				if(match) {
					match.forEach((elem)=>{
						this.emit('found', file, elem);
					});
				}
			});
		});

		return this;
	}
}

const findPatternObject = new FindPattern(/hello \w+/);

findPatternObject
	.addFile('fileA.txt')
	.addFile('fileB.json')
	.find()
	.on('fileread', (file)=>{
		console.log(`Reading the file ${file}`);
	})
	.on('found', (file, match)=>{
		console.log(`Match ${match} in file ${file}`);
	})
	.on('error', (err)=>{
		console.log(`Error emitted ${err.message}`);
	});