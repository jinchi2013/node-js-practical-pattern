"use strict";
const chance = require('chance').Chance();

require('http').createServer((req, res)=>{
    res.writeHead(200, {'Content-Type': 'text/plain'});

    function generateMore() {
        while( chance.bool({likelihood: 95}) ) {
            let shouldContinue = res.write(
                chance.string({length: (16 * 1024) - 1})
            );

            if(!shouldContinue) {
                console.log("Back Pressure -- no place in internal buffer");
                return res.once('drain', generateMore);
            }

            res.end(`\n The end.. \n`, ()=>{
                console.log('All data was sent !!!');
            });
        }
    }

    generateMore();
}).listen(8080, ()=>{
    console.log('Listening 8080');
});