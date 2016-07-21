const cp = require('child_process');
const child = cp.fork('./worker.js');

child.on('message', (m)=>{
	//Recevie results from child process
	console.log('received: ' + m);
});

//send child process some work
child.send('Please up-case this string');