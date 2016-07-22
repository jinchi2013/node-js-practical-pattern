const http = require('http');

//option to used by request
const options = {
	host:'localhost',
	port:'8081',
	path:'/index.html'
};

//Callback function is used to deal with response
var Callback = function(response){
	var body = '';
	response.on('data', (data)=>{
		body += data;
	});

	response.on('end', ()=>{
		//Data received completely
		console.log(body);
	});
};

//Make a request to the server
var req = http.request(options, Callback);
req.end();