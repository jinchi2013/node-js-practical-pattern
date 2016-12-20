"use strict";

const http = require('http');
const fs = require('fs');
const zlib = require('zlib');

let server = http.createServer((req, res)=>{
    let filename = req.headers.filename;
    console.log(`File request received ${filename}`);

    req.pipe(zlib.createGunzip())
        .pipe(fs.createWriteStream(filename))
        .on('finish', () => {
            res.writeHead(201, {'Content-Type': 'text/plain'});
            res.end('This\'s it\n');
            console.log(`File saved ${filename}`);
        });
});

server.listen(3000, () => {
    console.log('Listening port 3000');
});