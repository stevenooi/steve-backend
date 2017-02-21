var http = require('http');
var ApiSettings = require('../config/apiSettings');

module.exports = 
{
	callRmsHandler: function(obj)
	{ 
		var post_data = obj;

		var options = {
		  host: ApiSettings.RMS_HANDLER_SERVER_HOST,
		  port: ApiSettings.RMS_HANDLER_SERVER_PORT,
		  path: '/api/receiveRmsCall',
		  method: 'POST'
		};

		var post_req = http.request(options, function(res) {
		  console.log('STATUS: ' + res.statusCode);
		  console.log('HEADERS: ' + JSON.stringify(res.headers));
		  res.setEncoding('utf8');
		  res.on('data', function (chunk) {
			console.log('BODY: ' + chunk);
		  });
		});
		
		console.log("obj:" + JSON.stringify(obj));
		// post the data
		post_req.write(JSON.stringify(obj));
		post_req.end();
	}
}

