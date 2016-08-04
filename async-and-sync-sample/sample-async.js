/**
 * Created by chi on 8/4/16.
 */
'use strict';
const fs = require('fs');
console.log('start reading a file...');
fs.readFile('file.md', 'utf-8', (err, content)=>{
    if(err){
        console.log('error happened during reading the file');
        return console.log(err);
    }
    console.log(`this is async reading content :  ${content}`);
});
console.log('end of the file');