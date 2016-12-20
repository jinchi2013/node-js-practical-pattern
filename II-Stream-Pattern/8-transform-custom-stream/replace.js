"use strict";

// execute following in the conmand line
// echo Hello World! | node replace.js World Node.js

const ReplaceStream = require('./replaceStream');

process.stdin
    .pipe(new ReplaceStream(process.argv[2], process.argv[3]))
    .pipe(process.stdout);
