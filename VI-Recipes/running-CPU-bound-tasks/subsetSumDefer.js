var inherits = require('util').inherits;
var EventEmitter = require('events');

function SubsetSumDefer(sum, set) {
  EventEmitter.call(this);
  this.sum = sum;
  this.set = set;
  this.totalSubsets = 0;
}
inherits(SubsetSumDefer, EventEmitter);
module.exports = SubsetSumDefer;


// this is good only when the whole recusion process is not too long
// if the recusion process take hundreds of step to complete
// then intercept the process in each step would be a bad practice 
SubsetSumDefer.prototype._combineInterleaved = function(set, subset) {
	this.runningCombine++;
	setImmediate(function(){
		this._combine(set, subset);
		if(--this.runningCombine === 0){
			this.emit('end');
		}
	}.bind(this));
}


SubsetSumDefer.prototype._combine = function(set, subset) {
  for(var i = 0; i < set.length; i++) {
    var newSubset = subset.concat(set[i]);
    this._combineInterleaved(set.slice(i + 1), newSubset);
    this._processSubset(newSubset);
  }
}

SubsetSumDefer.prototype._processSubset = function(subset) {
  console.log('Subset', ++this.totalSubsets, subset);
  var res = subset.reduce(function(prev, item) {
    return prev + item;
  }, 0);
  if(res == this.sum) {
    this.emit('match', subset);
  }
}

SubsetSumDefer.prototype.start = function() {
  this.runningCombine = 0;
  this._combineInterleaved(this.set, []);
}

/**
  SetImmediate(cb)

  Schedules the "immediate" execution of the callback after I/O events' callbacks and 
  before timers created using setTimeout() and setInterval() are triggered. 
  Returns an Immediate for use with clearImmediate().

  When multiple calls to setImmediate() are made, 
  the callback functions are queued for execution in the order in which they are created. 
  The entire callback queue is processed every event loop iteration. 
  If an immediate timer is queued from inside an executing callback, 
  that timer will not be triggered until the next event loop iteration.

*/
