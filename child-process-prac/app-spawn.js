const fs = require('fs');
const child_process = require('child_process');

for(var i =0; i<3; i++){
	//child_process.spawn method spawns the child process asynchronously,
	//without blocking the Node.js event loop
	var workerProcess = child_process.spawn('node', ['support.js', i]);

	workerProcess.stdout.on('data', (data)=>{
		console.log(`stdout: ${data}`);
	});

	workerProcess.stderr.on('data', (data)=>{
		console.log(`stderr: ${data}`);
	});

	workerProcess.on('close', (code)=>{
		console.log(`child process exited with code ${code}`);
	});
}