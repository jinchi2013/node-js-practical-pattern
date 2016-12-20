"use strict";

const concatFile = require('./concatFiles');

concatFile(process.argv[2], process.argv.slice(3), ()=>{
    console.log('File concatenated successfully!');
});

/**
 * node concat ./test/allTogther.txt ./test/file1.txt ./test/file2.txt
 * */