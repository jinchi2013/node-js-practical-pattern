const spawn = require('child_process').spawn;
const child = spawn('node', ['child.js']);

//Send data to the child process via its stdin stream
child.stdin.write('hello, there !');

//Listen for any response from the child:
child.stdout.on('data', (data)=>{
	console.log('We received a reply: ' + data);
});

//Listen for any errors:
child.stderr.on('data', (data)=>{
	console.log('There was an error: ' + data);
});

child.on('exit', (code)=>{
	console.log(`child process exit on code: ${code}`);
});