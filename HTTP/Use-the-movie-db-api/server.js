var http = require("https");

var options = {
  "method": "GET",
  "hostname": "api.themoviedb.org",
  "port": null,
  "path": "/3/movie/top_rated?language=en-US&api_key=4bef8838c2fd078bd13d7127d8dedcd4&page=1",
  "headers": {}
};

var bodyJson;

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    bodyJson = JSON.parse(body);
    //console.log(body.toString());
  });
});

req.write("{}");
req.end();



var app = new (require('express'))();
var port = 3000;

app.get('/', function(req, res) {
	res.send(bodyJson);
})

app.listen(port, (error) => {
    if(error) {
        console.log(error);
    } else {
        console.info(`===> Listening on port %s. Open up http://localhost:%s/ in your browser`, port, port);
    }
});