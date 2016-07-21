//Unpause the stdin stream
//process.stdin.resume();

//Listen for incoming data:
process.stdin.on('data', (data)=>{

	console.log(`Received data in child.js : ${data}`);

	process.stdout.write(`Send ${data} back to the parents`);

	// process.exit(code), will stop this process with code 0
	process.exit(0);

});

