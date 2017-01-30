"use strict";

const child_process = require('child_process');
const net = require('net');
const path = require('path');

function multiplexChannels(sources, destination) {
    sources.forEach((source, index) => {
        source
            // read from the standard output and error of child process
            .on('readable', (index)=>{
                let chunk;
                while( (chunk = this.read()) !== null ) {
                    let outBuff = new Buffer(1 + 4 + chunk.length);
                    outBuff.writeUInt8(index, 0);
                    outBuff.writeInt32BE(chunk.length, 1);
                    chunk.copy(outBuff, 5);
                    console.log(`Sending packet to channel: ${index}`);
                    destination.write(outBuff);
                }
            })
    })
}

var socket = net.connect(3000, () => {
    let child = child_process.fork(
        process.argv[2],
        process.argv.slice(3),
        {silent: true}
    );
    multiplexChannels([child.stdout, child.stderr], socket);
});

socket.on('data', (data) => {
    console.log(`DATA: data got from the server -- ${data}`);
    // Close the client socket completely
    client.destroy();
});

// Add a 'close event handler for the client socket
client.on('close', ()=>{
    console.log('Connection Closed!');
});