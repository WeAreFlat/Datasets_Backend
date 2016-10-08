var http = require('http');
var https = require('https');

var server = http.createServer(function (request, response) {
	response.writeHead(200, {
		"Content-Type": "text/plain"
	});
	response.end("Hello World\n");

	var apiMethod = '/v1/Search/Property/Rental.json?'
	var consumerKey = 'D17F85682EC9E85C5331A5EC8A37EF6C&'
	var consumerSecret = 'E2C3B1648930003B5A57AEA51486DDF0%26'

	// options for GET
	var optionsget = {
		host: 'api.trademe.co.nz', // here only the domain name
		// (no http/https !)
		port: 443,
		path: apiMethod + 'oauth_consumer_key=' + consumerKey + 'oauth_signature_method=PLAINTEXT&oauth_signature=' + consumerSecret + '&search_string=Newmarket',


		method: 'GET' // do GET
	};

	console.info('Options prepared:');
	console.info(optionsget);
	console.info('Do the GET call');

	// do the GET request
	var reqGet = https.request(optionsget, function (res) {
		console.log("statusCode: ", res.statusCode);
		//  console.log("headers: ", res.headers);


		res.on('data', function (d) {
			console.info('GET result:\n');
			process.stdout.write(d);
			console.info('\n\nCall completed');
		});

	});

	reqGet.end();
	reqGet.on('error', function (e) {
		console.error(e);
	});


});


server.listen(7000);