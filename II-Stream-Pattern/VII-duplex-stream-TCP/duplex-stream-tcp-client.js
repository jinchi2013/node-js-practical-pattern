"use strict";

const net = require('net');

const host = '127.0.0.1';
const PORT = '6969';

let client = new net.Socket();
client.connect(PORT, host, () => {

    console.log(`CONNECTED TO: ${host} : ${PORT}`);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
    client.write('I am coming from Client Side');

});

client.on('data', (data) => {

    console.log(`DATA: ${data}`);
    // Close the client socket completely
    client.destroy()
});

// Add a 'close' event handler for the client socket
client.on('close', function() {
    console.log('Connection closed');
});