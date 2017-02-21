const mysql = require("mysql");

var dbConn = require('./../config/db_conn');
 
module.exports = 
{

getRoleData: function(res)
{ 
	const con = dbConn.openConnection();

	let data = "";
	con.query('SELECT * FROM role',function(err,rows){
	  if(err) throw err;

	  console.log(rows);
	  data = rows.map(row => { 
		return { id: row.id, name: row.name}
	  });
	  
	  dbConn.closeConnection(con);
	  return res.json(data); 
	});  
},

getRoleDataById: function(res,id)
{ 
	const con = dbConn.openConnection(); 
	let data = "";
	con.query('SELECT * FROM role where id=?',id,function(err,rows){
	  if(err) throw err;

	  console.log(rows);
	  data = rows.map(row => { 
		return { id: row.id, name: row.name}
	  });
	  
	  dbConn.closeConnection(con);
	  return res.json(data); 
	});  
	

},

/*

getRoleDataById: function(req,res)
{ 
	var dataReceived = "";
	req.on('data', function (data) {
		dataReceived += data; 
		console.log(data);
	}); 
	
	req.on('end', function () {
		dataReceived = JSON.parse(dataReceived);
		
		const con = dbConn.openConnection();

		let data = "";
		con.query('SELECT * FROM role where id=?',dataReceived["id"],function(err,rows){
		  if(err) throw err;

		  console.log(rows);
		  data = rows.map(row => { 
			return { id: row.id, name: row.name}
		  });
		  
		  dbConn.closeConnection(con);
		  return res.json(data); 
		});  
	})

},
*/

addData: function(req,res)
{ 
	var dataReceived = "";
	req.on('data', function (data) {
		dataReceived += data; 
	}); 
	req.on('end', function () {
		dataReceived = JSON.parse(dataReceived);
		var updateDBfield  = {
		  name: dataReceived["name"]
		};
		console.log("updateDBfield: " + updateDBfield);
		console.log("dataReceived.name: " + dataReceived.name	);
		
		const con = dbConn.openConnection(); 

		con.query('INSERT INTO codmgr2.role SET ?', updateDBfield, function(err, result) {
			
			dbConn.closeConnection(con);
			if(err) 
			{
				console.error ("err.message:" + err.message  + "result: " + result) ;
				if(err.message.includes("ER_DUP_ENTRY"))
					res.statusMessage = "Duplicated data is not allowed";
				else
					res.statusMessage = "Server is not responding. Please try again later";
				res.status(500).end();
			} 
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
		var updateDBfield  = {
		  name: dataReceived["name"]
		}; 
		var updateDBfield2  = {
		  id: dataReceived["id"]
		}; 
		console.log("here3");
		const con = dbConn.openConnection(); 
 
		con.query('UPDATE codmgr2.role SET name=? WHERE id=?', [dataReceived["name"],dataReceived["id"]], function(err, result) {
			 
			dbConn.closeConnection(con);
			if(err) 
			{
				console.error ("err.message:" + err.message  + "result: " + result) ;
				if(err.message.includes("ER_DUP_ENTRY"))
					res.statusMessage = "Duplicated data is not allowed";
				else
					res.statusMessage = "Server is not responding. Please try again later";
				res.status(500).end();
			} 
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
		console.log("data:" + data);
	}); 
	req.on('end', function () { 
		dataReceived = JSON.parse(dataReceived); 
		
		const con = dbConn.openConnection(); 
 
		con.query('DELETE FROM codmgr2.role WHERE id=?', dataReceived["id"], function(err, result) {
			 
			dbConn.closeConnection(con);
			if(err) 
			{
				console.error ("err.message:" + err.message  + "result: " + result) ;
				if(err.message.includes("ER_DUP_ENTRY"))
					res.statusMessage = "Duplicated data is not allowed";
				else
					res.statusMessage = "Server is not responding. Please try again later";
				res.status(500).end();
			} 
			else{ 
				return res.json("success"); 
			}
		});
	});
	
}



};