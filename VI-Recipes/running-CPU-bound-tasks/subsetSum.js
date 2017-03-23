var inherits = require('util').inherits;
var EventEmitter = require('events');

function SubSetSum(sum, set) {
	this.sum = sum;
	this.set = set;
	this.totalSubset = 0;
}

inherits(SubserSum, EventEmitter);
module.exports = SubsetSum;

SubsetSum.prototype._combine = function(set, subset) {
	for(var i= 0; i < set.length; i++) {
		var newSubset = subset.concat(set[i]);
		this._combine(set.slice(i + 1), newSubset);
		this._processSubset(newSubset);
	}
}

SubsetSum.prototype._processSubset = function(subset) {
	console.log('Subset', ++this.totoalSubsets, subset);
	var res = subset.reduce(function(prev, item) {
		return prev + item;
	}, 0);
	if(res == this.sum) {
		this.emit('match', subset);
	}
}

SubsetSum.prototype.start = function() {
  this._combine(this.set, []); // sync process
  							   // block I/O until this is done
  this.emit('end');
}
