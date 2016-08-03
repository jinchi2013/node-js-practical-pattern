const http = require('http');
const fs = require('fs');
const url = require('url');

const os = require('os');
const iFaces = os.networkInterfaces();
const getLocalIp = () => {
	var localIp ='';
	Object.keys(iFaces).forEach( (ifName)=>{
		//console.log(ifName);
		iFaces[ifName].forEach( (iFace)=>{
			//console.log(iFace);
			if( iFace.family === 'IPv4' && iFace.internal === false){

				localIp = iFace.address;
			}
		} );
	} );
	if( localIp === '' ){
		return null;
	}
	return {
		localIp: localIp
	};
};
//Create a server
http.createServer( (req, res)=>{
	// Parse the request containing file name
	var pathname = url.parse(req.url).pathname;

	// Print the name of  the file for which request is made.
	console.log( `Request for ${pathname} received... ` );

	//Read the requested file content from file system 
	fs.readFile(pathname.substr(1), (err, data)=>{
		if(err){
			console.log(err);
			//HTTP Status : 404 : NOT FOUND
			//Content Type: text/html
			res.writeHead(404, {'Content-Type':'text/html'});
		} else {
			//Page found
			// HTTP Status: 200 : OK
			// Content Type : text/html
			res.writeHead(200, {'Content-Type':'text/html'});

			//Write the content of the file to res body
			res.write(data.toString());
		}

		//Send the res body
		res.end();
	});
}).listen(8081, `${getLocalIp().localIp}`, ()=>{
	//Console will print the message
	console.log('Server running at port 8081');
});
