var fork = require('child_process').fork;

function ProcessPool(file, poolMax) {
	this.file = file;
	this.poolMax = poolMax;
	this.pool = []; // used to queue workers
	this.active = []; // used to have active workers
	this.waiting = []; // use to contain the waiting callback
}

module.exports = ProcessPool;

ProcessPool.prototype.acquire = function(callback) {
	var worker;
	if(this.pool.length > 0) {
		worker = this.pool.pop();
		this.active.push(worker);
		return process.nextTick(callback.bind(null, null, worker));
	}

	if(this.active.length >= this.poolMax) {
		return this.waiting.push(callback);
	}

	worker = fork(this.file);
	this.active.push(worker);
	process.nextTick(callback.bind(null, null, worker));
}

ProcessPool.prototype.release = function(worker) {
	if(this.waiting.length > 0) {
		var waitingCallback = this.waiting.shift();
		waitingCallback(null, worker);
	}

	this.active = this.active.filter(function(w) { // filter out the release work from the active array
		return worker !== w;
	});

	this.pool.push(worker);
}


/**
	process.nextTick()

	The process.nextTick() method adds the callback to the "next tick queue". 
	Once the current turn of the event loop turn runs to completion, 
	all callbacks currently in the next tick queue will be called.

	It runs before any additional I/O events (including timers) fire in subsequent ticks of the event loop.

	Note: the next tick queue is completely drained on each pass of the event loop before additional I/O is processed. 
	As a result, recursively setting nextTick callbacks will block any I/O from happening, just like a while(true); loop.

*/

/**
	child_process.fork()

	The child_process.fork() method is a special case of child_process.spawn() used specifically to spawn new Node.js processes. 
	Like child_process.spawn(), a ChildProcess object is returned. 
	The returned ChildProcess will have an additional communication channel built-in that allows messages to be passed back and 
	forth between the parent and child. See child.send() for details.

	

*/