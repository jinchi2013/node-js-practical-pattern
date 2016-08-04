/**
 * Created by chi on 8/4/16.
 */
"use strict";
const async = require('async');
const fs = require('fs');

async.map(
    ['file1.md', 'file2.md', 'file3.md'],
    fs.readFile,
    (err, result)=>{
        if(err){
            return console.log(err)
        }
        console.log(result);
    }
);

