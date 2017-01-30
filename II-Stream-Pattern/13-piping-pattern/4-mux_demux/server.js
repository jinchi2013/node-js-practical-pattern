"use strict";
const net = require('net');
const fs = require('fs');

function demultiplexChannel(source, destinations) {
    let currentChannel = null;
    let currentLength = null;

    source
        .on('data', (data)=>{
            var chunk;
            if(currentChannel === null) {
                chunk = this.read(1);
                currentChannel = chunk && chunk.readUInt8(0);
            }

            if(currentLength === null) {
                chunk = this.read(4);
                currentLength = chunk && chunk.readUInt32BE(0);
                if(currentLength === null) {
                    return;
                }
            }

            chunk = data;
            if(chunk === null) {
                return;
            }
            console.log(`Received Packet from: ${currentChannel}`);
            destinations[currentChannel].write(chunk);
            currentChannel = null;
            currentLength = null;
        })
        .on('end', ()=>{
            destinations.forEach((destination) => {
                destination.end();
            });
            console.log('Source channel closed !!!');
        });

}

net.createServer((socket) => {
    let stdoutStream = fs.createWriteStream('stdout.log');
    let stderrStream = fs.createWriteStream('stderr.log');

    demultiplexChannel(socket, [stdoutStream, stderrStream]);
}).listen(3000, ()=>{
    console.log('Server started !!! ...');
});
