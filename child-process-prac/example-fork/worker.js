process.on('message', (m)=>{
	//Do work (in this case just up-case the string)

	m = m.toUpperCase();

	//Pass results back to parent process
	process.send(m);
});