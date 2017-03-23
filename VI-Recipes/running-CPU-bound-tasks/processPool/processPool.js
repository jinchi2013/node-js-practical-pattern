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
