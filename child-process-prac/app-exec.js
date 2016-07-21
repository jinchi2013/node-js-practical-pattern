const fs = require('fs');
const child_process = require('child_process');

for(var i=0; i<3; i++) {
	//spawns a shell and run a command within that shell
	var workerProcess = child_process.exec('node support.js '+i, (error, stdout, stderr) => {
		if(error) {
			console.log(error.stack);
			console.log('Error code: ' + error.code);
			console.log('Signal received: ' + error.signal);
		}
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
	});

	workerProcess.on('exit', (code) => {
		console.log('Child process exited with exit code' + code);
	});
}