const mysql = require("mysql");

var dbConn = require('./../config/db_conn');
var errorHandler = require('./../utils/error_handler');
var logger = require('./../utils/custom_logger'); 
 
module.exports = 
{

getUserData: function(req,res)
{  
	var dataReceived = "";
	req.on('data', function (data) {
		dataReceived += data;  
	}); 
	req.on('end', function () { 
		dataReceived = JSON.parse(dataReceived); 
	
		const con = dbConn.openConnection();

		let data = "";
		con.query('SELECT u.* FROM user u inner join company c on c.id = u.company_id where u.is_delete=0 and u.company_id LIKE ?',[dataReceived["reqcompanyid"]],function(err,rows){
		if(err) return errorHandler.generateErrorMessage(err,res);
		 
		  data = rows.map(row => { 
			return { id: row.id, userid: row.userid}
		  });
		  
		  dbConn.closeConnection(con);
		  return res.json(data); 
		});
	});	
},
getAllRole: function(res)
{ 
	const con = dbConn.openConnection();

	let data = "";
	con.query('SELECT * FROM role where is_delete=0',function(err,rows){
	if(err) return errorHandler.generateErrorMessage(err,res);
	
	  console.log(rows);
	  data = rows.map(row => { 
		return { id: row.id, name: row.name}
	  });
	  
	  dbConn.closeConnection(con);
	  return res.json(data); 
	});  
},

getUserDataById: function(res,id)
{ 
	const con = dbConn.openConnection(); 
	let data = "";
	con.query('SELECT * FROM user where id=?',id,function(err,rows){
	if(err) return errorHandler.generateErrorMessage(err,res);
	
	  console.log(rows);
	  data = rows.map(row => { 
		return { id: row.id, userid: row.userid, roleId: row.role_id}
	  });
	  
	  dbConn.closeConnection(con);
	  return res.json(data); 
	});  
	

},
 
addData: function(req,res)
{ 
	var dataReceived = "";
	req.on('data', function (data) {
		dataReceived += data; 
	}); 
	req.on('end', function () {
		dataReceived = JSON.parse(dataReceived);
		var updateDBfield  = {
		  userid: dataReceived["userid"],
		  password: dataReceived["password"],
		  role_id: dataReceived["roleid"],
		  company_id: dataReceived["companyid"]
		};
		
		var message = "Add User [username:" + dataReceived["userid"] + ", roleId:" + dataReceived["roleid"] + ", company_id:" + dataReceived["companyid"] + "]";
		logger.info(dataReceived, message);
		
		const con = dbConn.openConnection(); 

		con.query('INSERT INTO user SET ?', updateDBfield, function(err, result) {
			
			dbConn.closeConnection(con);
			if(err) return errorHandler.generateErrorMessage(err,res);
			else{ 
				return res.json("success"); 
			}
		});
	});
	
},
editData: function(req,res)
{ 
	var dataReceived = "";
	req.on('data', function (data) {
		dataReceived += data; 
		console.log(data);
	}); 
	req.on('end', function () { 
		dataReceived = JSON.parse(dataReceived); 
		 
		var message = "Edit User [username:" + dataReceived["userid"] + ", roleId:" + dataReceived["roleid"] + ", company_id:" + dataReceived["companyid"] + "]";
		logger.info(dataReceived, message,req);
	 
		const con = dbConn.openConnection(); 
 
		con.query('UPDATE user SET userid=?,role_id=?,company_id=? WHERE id=?', [dataReceived["userid"],dataReceived["roleid"],dataReceived["companyid"],dataReceived["id"]], function(err, result) {
			 
			dbConn.closeConnection(con);
			if(err) return errorHandler.generateErrorMessage(err,res);
			else{ 
				return res.json("success"); 
			}
		});
	});
	
},
deleteData: function(req,res)
{ 
	var dataReceived = "";
	req.on('data', function (data) {
		dataReceived += data; 
		//console.log("data:" + data);
	}); 
	req.on('end', function () { 
		dataReceived = JSON.parse(dataReceived); 
		
		var message = "Delete User [id:" + dataReceived["id"] + "]";
		logger.info(dataReceived, message);
	
		const con = dbConn.openConnection(); 
 
		con.query('UPDATE user SET is_delete=1 WHERE id=?', dataReceived["id"], function(err, result) {
			 
			dbConn.closeConnection(con);
			if(err) return errorHandler.generateErrorMessage(err,res);
			else{ 
				return res.json("success"); 
			}
		});
	});
	
},

updatePassword: function(req,res)
{ 
	var dataReceived = "";
	req.on('data', function (data) {
		dataReceived += data; 
		//console.log("data:" + data);
	}); 
	req.on('end', function () { 
		dataReceived = JSON.parse(dataReceived); 
		
		const con = dbConn.openConnection(); 
		
		var message = "Change User Password [username:" + dataReceived["username"] + "]";
		logger.info(dataReceived, message);
		
		con.query('UPDATE user SET password=? WHERE userid=?', [dataReceived["password"],dataReceived["username"]], function(err, result) {
			 
			dbConn.closeConnection(con);
			if(err) return errorHandler.generateErrorMessage(err,res);
			else{ 
				return res.json("success"); 
			}
		});
	});
	
},
verifyLogin: function(req,res)
{ 

	var dataReceived = "";
	req.on('data', function (data) {
		dataReceived += data;  
	});  
	req.on('end', function () { 
		dataReceived = JSON.parse(dataReceived); 
		 
		const con = dbConn.openConnection(); 
		let data = "";
		//con.query('SELECT u.id,u.password,r.name as roleName FROM user u INNER JOIN role r on u.role_id = r.id where u.userid=? and r.is_delete=0 ',[dataReceived["username"]],function(err,rows){
		con.query("SELECT u.id,u.password,'superadmin',u.company_id,c.name as company_name FROM user u LEFT JOIN company c on c.id = u.company_id where u.userid=? +",[dataReceived["username"]],function(err,rows){
		if(err) return errorHandler.generateErrorMessage(err,res);  
		  var returnObj = {};
		  var message = "";
		  if(rows.length == 0)
		  { 
			  returnObj.responseCode = 2;
			  returnObj.message = "Username not found";
			  var message = "Login User - Username not found [username:" + dataReceived["username"] + "]";
			  logger.info(dataReceived, message);
		  }
		  else
		  {
			  if(rows[0].password == dataReceived["password"])
			  {
				  returnObj.responseCode = 1;
				  returnObj.roleCode = rows[0].roleName;
				  returnObj.companyId = rows[0].company_id;
				  returnObj.companyName = rows[0].company_name;
				  returnObj.message = "login successful";
						  
				  var message = "Login User - Success [username:" + dataReceived["username"] + "]";
				  logger.info(dataReceived, message);
			  }
			  else
			  {
				  returnObj.responseCode = 3;
				  returnObj.message = "Invalid password";
				  var message = "Login User - Failed [username:" + dataReceived["username"] + "]";
				  logger.info(dataReceived, message);
			  }
		  }
			
		  //console.log("returnObj:" + (JSON.stringify(returnObj)));
		  dbConn.closeConnection(con);
		  return res.json(returnObj);  
		});  
	});

}


};