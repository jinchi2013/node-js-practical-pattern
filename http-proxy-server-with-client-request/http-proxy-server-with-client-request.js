const http = require('http');
const net = require('net');
const url = require('url');

//Create an HTTP tunneling proxy
var proxy = http.createServer((req, res) => {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('okey');
});

// connect event with fire when the server receive a request with CONNECT method
// the socket in the callback would be the clientSocket
// will be used to write data to the client side
proxy.on('connect', (req, clientSocket, head) => {
	var serverUrl = url.parse(`http://${req.url}`);
	// the origin server will connected here
	var serverSocket = net.connect(serverUrl.port, serverUrl.hostname, ()=>{
		// write into clientSocket will trigger the req's connect event
		// here the content in write is a request to the client socket
		clientSocket.write(
				'HTTP/1.1 200 Connection Established\r\n' +
                'Proxy-agent: Node.js-Proxy\r\n' +
                '\r\n'
			);

		// not sure what is this meaning
		// head is a buffer
		serverSocket.write(head);

		// Here serverSocket send data back 
		serverSocket.pipe(clientSocket);

		// And here would be the response data from clientSocket and pipe into the serverSocket
		clientSocket.pipe(serverSocket);
	});
})

// starting proxy server
proxy.listen(1337, '127.0.0.1', ()=>{
	console.log('proxy server is running');

/******************************************************************************************/
/** BELOW HERE IS THE CLIENT SIDE REQUEST**/

	// make a request to a tunneling proxy
	// the path below : www.google.com:80 would be the server you want to connected with
	var options = {
		port: 1337,
		hostname: '127.0.0.1',
		method: 'CONNECT',
		path: 'www.google.com:80'
	};

	var req = http.request(options);
	// here the req must be end
	// or the req will be hanging there until error happens
	req.end();

	req.on('connect', (res, serverSocket, head) => {
		console.log('Got connected with the www.google.com:80 !');

		// make a request over an HTTP tunnel
		// this socket should be the serverSocket
		serverSocket.write('GET / HTTP/1.1\r\n' +
                 'Host: www.google.com:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');
		serverSocket.on('data', (chunk) => {
			// will recevie chunk data, when serverSocket.pipe(clientSocket); in the serverSocket above
			console.log(chunk.toString());
		});
		serverSocket.on('end', ()=>{
			proxy.close();
		});
	})
});