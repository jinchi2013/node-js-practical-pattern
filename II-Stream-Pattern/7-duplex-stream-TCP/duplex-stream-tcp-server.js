"use strict";

const net = require('net');

const host = '127.0.0.1';
const PORT = '6969';

// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection

// net module will create a tcp socket server
net.createServer((sock) => {

    console.log(`CONNECTED: ${sock.remoteAddress} : ${sock.remotePort}`);

    sock.on('data', (data) => {
        console.log(`DATA ${sock.remoteAddress} : data : ${data}`);
        sock.write(`You said ${data}`);
    });

    sock.on('close', (data) => {
        console.log(`CLOSED: ${sock.remoteAddress} ${sock.remotePort}: ${data}`);
    });
}).listen(PORT, host);

console.log(`TCP server listening on ${host}:${PORT}`);

// var server = net.createServer();
// server.listen(PORT, HOST);
// console.log('Server listening on ' + server.address().address +':'+ server.address().port);
// server.on('connection', function(sock) {
//
//     console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
//     // other stuff is the same from here
//
// });
