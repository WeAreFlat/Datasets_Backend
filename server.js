var http = require('http');
var fs = require('fs');
var XMLHttpRequest = require('xhr2');

var server = http.createServer(function (req, res) {
	displayForm(res);
});

var someJSON = require('./suburbs.json');
// var actualJSON = JSON.parse(someJSON);

function displayForm(res) {
	fs.readFile('index.html', function (err, data) {
		res.writeHead(200, {
			'Content-Type': 'text/html',
			'Content-Length': data.length
		});
		res.write(data);
		res.end();
	});
}

server.listen(1185);
console.log("server listening on 1185");