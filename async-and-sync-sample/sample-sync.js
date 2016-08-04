/**
 * Created by chi on 8/4/16.
 */
'use strict';
const fs = require('fs');
let content;
try {
    content = fs.readFileSync('file.md', 'utf-8')
} catch (ex) {
    console.log(ex);
}
console.log(content);