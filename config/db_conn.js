const mysql = require("mysql");

//Database settings
var hostname = "localhost";
var username = "root";
var dbpassword = "password";
var databasename = "steven";

module.exports = 
{
	openConnection: function(res)
	{ 
		return mysql.createConnection({
		  host: hostname,
		  user: username,
		  password: dbpassword,
		  database: databasename
		});
	},
	
	closeConnection: function(con)
	{ 
		con.end(function(err) { 
			
		});
	}
  
};