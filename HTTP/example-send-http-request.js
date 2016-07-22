const querystring = require('querystring');


var postData = querystring.stringify({
	'msg': 'Hello World!'
});

var options = {
	hostname: 'www.google.com',
	port: 8000,
	path: '/upload',
	method: 'POST',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': postData.length
	}
};


const http = require('http');
var req = http.request(options, (res) => {
	console.log(`STATUS: ${res.statusCode}`);
	console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

	res.setEncoding('utf8');
	res.on('data', (chunk) => {
		console.log(`BODY: ${chunk}`);
	});
	res.on('end', () => {
		console.log('No more data in response. ');
	});
});

req.on('error', (e) => {
	console.log(`problem with request: ${e.message}`);
});

//write data to request body
req.write(postData);
req.end();