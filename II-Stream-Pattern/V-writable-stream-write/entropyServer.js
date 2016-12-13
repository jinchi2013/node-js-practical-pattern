"use strict";
const chance = require('chance').Chance();

require('http').createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    while(chance.bool({likelihood: 95})) {
        res.write(`${chance.string()} \n `);
    }
    res.end('\n The end...');
    res.on('finish', () => {
        console.log('All data was sent!');
    });
}).listen(8080, ()=>{
    console.log('Listening to port 8080');
});