const http = require('http');
const net =require('net');
const url = require('url');

//Create an HTTP tunneling proxy
var proxy = http.createServer( (req, res)=>{
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('okay');
});

proxy.on('connect', (req, cltSocket, head)=>{
	//connect to an origin server
	var srvUrl = url.parse(`http://${req.url}`);
	var srvSocket = net.connect(srvUrl.port, 
								srvUrl.hostname, 
								()=>{
									cltSocket.write('HTTP/1.1 200 Connection Established\r\n' + 
													'Proxy-agent: Node.js-Proxy\r\n' + 
													'\r\n');
									srvSocket.write(head);
									srvSocket.pipe(cltSocket);
									srvSocket.pipe(srvSocket);
								});

});

//now that proxy is running
proxy.listen(1337, 'localhost', ()=>{
	

	//make a request to a tunneling proxy
	var options = {
		port: 1337,
		hostname:'localhost',
		method:'CONNECT',
		path: 'www.google.com:80'
	};

	var req = http.request(options);
	req.end();

	req.on('connect', (res, socket, head) => {
		console.log('got connnected!');



		//make a request over an HTTP tunnel
		socket.write('GET / HTTP/1.1\r\n' + 
					 'Host: www.google.com:80\r\n' + 
					 'Connection: close\r\n' + 
					 '\r\n');

		socket.on('data', (chunk)=>{
			console.log(chunk.toString());
		});

		socket.on('end', ()=>{
			proxy.close();
		});
	});
});