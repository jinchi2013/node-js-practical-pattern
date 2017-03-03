var http = require("https");

module.exports = function(options) {
	var ret;
	var req = http.request(options, function (res) {
	  var chunks = [];

	  res.on("data", function (chunk) {
	    chunks.push(chunk);
	  });

	  res.on("end", function () {
	    var body = Buffer.concat(chunks);
	    ret = JSON.parse(body);
	  });
	});

	req.write("{}");
	req.end();

	return ret;
}