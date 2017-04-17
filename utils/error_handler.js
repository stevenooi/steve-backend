var logger = require('./custom_logger'); 

module.exports = 
{

generateErrorMessage: function(err,res)
{  
	var date = new Date();
    var timestamp = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    console.error(timestamp + "," + err + "\n" ); 
    let message = "Error processing request. Please check with administrator"; 
	if(err.message.includes("ER_DUP_ENTRY"))
		message = "Duplicated data is not allowed";
	
	res.statusMessage = message;
	let errMessage = {error:message,time: timestamp};
	res.status(500);
	
	var logMessage = "Error : [" + logMessage + "]";
	logger.info("", logMessage);

	return res.json(errMessage);
}

};