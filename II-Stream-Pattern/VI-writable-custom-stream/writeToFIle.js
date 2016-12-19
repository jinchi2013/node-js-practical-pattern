"use strict";

const ToFileStream = require('./toFileStream');
const tfs = new ToFileStream({objectMode: true});

// For each one of these objects, our stream has to save the content part into a file
// created at the given path.
// We cae see that the input of our stream are objects
// and not strings or buffers;
// this means that our stream has to work in oject mode
tfs.write.call(tfs, {path: "./test/file1.txt", content: "Hello"}, 'utf8', ()=>{
    console.log('file1 done');
});
tfs.write.call(tfs, {path: "./test/file2.txt", content: "Node.js"}, 'utf8', ()=>{
    console.log('file2 done');
});
tfs.write.call(tfs, {path: "./test/file3.txt", content: "Stream"}, 'utf8', ()=>{
    console.log('file3 done');
});

tfs.end( () => {
    console.log('All files created');
});