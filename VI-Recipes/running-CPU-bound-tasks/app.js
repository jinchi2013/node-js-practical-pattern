var http = require('http');
// var Subsetsum = require('./Subsetsum');
// var Subsetsum = require('./subsetSumDefer');
var SubsetSum = require('./processPool/subsetForkSum')

http.createServer(function(req, res){
	var url = require('url').parse(req.url, true);

	if(url.pathname === '/subsetSum') {
		var data = JSON.parse(url.query.data);
		res.writeHead(200);

		var subsetSum = new SubsetSum(url.query.sum, data);
		// the new here is just subsetForkSum class, not the ProcessPool ! !

		subsetSum.on('match', function(match) {
			res.write(`Match: ${JSON.stringify(match)} \n`);
		});

		subsetSum.on('end', function(){
			res.end();
		});

		subsetSum.start();
	} else {
		res.writeHead(200);
		res.end('I\m alive!\n');
	}
}).listen(8000, function() {console.log('Started!')});
