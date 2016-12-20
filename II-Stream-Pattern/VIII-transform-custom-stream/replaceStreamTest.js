"use strict";

const ReplaceStream = require('./replaceStream');

let rs =  new ReplaceStream({decodeStrings: false}, 'World', 'Node.js');

rs.write.call(rs, 'Hello W');
rs.write.call(rs, 'orld');

rs.on('data', (chunk) => {
    console.log(chunk.toString());

});

rs.end();