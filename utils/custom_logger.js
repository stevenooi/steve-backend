const fs = require('fs');
var winston = require('winston');
var logger = null;
module.exports = 
{
createLogger: function(level)
{  
	var tempLevel = level;
	if(tempLevel == null || tempLevel == "")
		tempLevel = "info";
	
	const logDir = 'log';
	const env = process.env.NODE_ENV || 'development';
	const tsFormat = () => (new Date()).toLocaleTimeString();
	// Create the log directory if it does not exist
	if (!fs.existsSync(logDir)) {
	  fs.mkdirSync(logDir);
	}

	logger = new (winston.Logger)({
	  transports: [
		// colorize the output to the console
		new (winston.transports.Console)({
		  timestamp: tsFormat,
		  colorize: true,
		  level: tempLevel
		}),		
		new (require('winston-daily-rotate-file'))({
		  filename: `${logDir}/-codmgrbe.log`,
		  timestamp: tsFormat,
		  datePattern: 'yyyy-MM-dd',
		  prepend: true,
		  level: env === 'development' ? 'verbose' : 'info'
		})
	  ]
	});
	 
	return logger;

},
info: function(dataReceived,message)
{
	module.exports.info(dataReceived,message, req);
	/*
	var returnMessage = "";
	
	if(logger == null)
	{
		module.exports.createLogger("info");
	}
	
	if(dataReceived["reqtime"] != null)
		returnMessage += "client_time: " + dataReceived["reqtime"];
	if(dataReceived["requser"] != null)
		returnMessage += " user: " + dataReceived["requser"];
	
	returnMessage += " action: " + message;
	
	logger.info(returnMessage);
	*/
},
info: function(dataReceived,message, req)
{
	var returnMessage = "";
	
	if(logger == null)
	{
		module.exports.createLogger("info");
	}
	
	if(dataReceived != null && dataReceived["reqtime"] != null)
		returnMessage += "client_time: " + dataReceived["reqtime"];
	if(dataReceived != null && dataReceived["requser"] != null)
		returnMessage += " user: " + dataReceived["requser"];
	if(req != null)
		returnMessage += " ip: " + req.connection.remoteAddress;
		
	returnMessage += " action: " + message;
	
	logger.info(returnMessage);
},
debug: function(message)
{
	if(logger == null)
	{
		module.exports.createLogger("info");
	}
	logger.debug(message);
}

};