const child = require('child_process').fork('submain.js');

//open up the server object and send the handle.
const server = require('net').createServer();

server.on('connection', (socket) => {
	socket.end('handled By parent');
});

server.listen(1337, () => {
	child.send('server', server);
});