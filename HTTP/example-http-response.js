var http = require('http');

http.createServer(function(request, response){
	var headers = request.headers;
	var method = request.method;
	var url = request.url;
	var body = [];

	request.on('error', (err) => {
		console.log(err);
	}).on('data', (chunk) => {
		body.push(chunk);
	}).on('end', () => {
		body =  Buffer.concat(body).toString();

		response.on('error', (err) => {
			console.log(err);
		});

		response.statusCode = 200;
		response.setHeader('Content-Type', 'application/json');
		//response.writeHead(200, {'Content-Type': 'application/json'})

		var responseBody = {
			headers: headers,
			method: method,
			url: url,
			body: body
		};

		response.write(JSON.stringify(responseBody));
		response.end();
		// response.end( JSON.stringify(responseBody) );
	});
}).listen(8080);
console.log('localhost:8080 starting...');