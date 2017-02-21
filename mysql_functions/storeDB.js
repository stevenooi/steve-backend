const mysql = require("mysql");

var dbConn = require('./../config/db_conn');
 
module.exports = 
{

getStoreData: function(res)
{ 
	const con = dbConn.openConnection();

	let data = "";
	con.query('SELECT * FROM store where is_delete=0',function(err,rows){
	  if(err) throw err;

	 // console.log(rows);
	  data = rows.map(row => { 
		return { id: row.id, name: row.name, saltid: row.salt_id}
	  });
	  
	  dbConn.closeConnection(con);
	  return res.json(data); 
	});  
},

getStoreDataById: function(res,id)
{ 
	const con = dbConn.openConnection(); 
	let data = "";
	con.query('SELECT s.*,t.name as template_name FROM store s LEFT JOIN codmgr2.template t ON t.id=s.template_id where s.is_delete=0 and s.id=?',id,function(err,rows){
	//con.query('SELECT * FROM store where is_delete=0 and id=?',id,function(err,rows){
	//con.query('SELECT s.* FROM codmgr2.store s LEFT JOIN codmgr2.template t ON t.id=s.template_id LEFT JOIN codmgr2.category c ON c.id=s.category_id where s.is_delete=0 and s.id=?',id,function(err,rows){
	    if(err) throw err;

	  console.log(rows);
	  data = rows.map(row => { 
		return { id: row.id, name: row.name, saltId: row.salt_id, templateId: row.template_id, groupId: row.category_id,templateName: row.template_name}
	  });
	  
	  dbConn.closeConnection(con);
	  return res.json(data); 
	});  
	

},

getAllTemplates: function(res)
{ 
	const con = dbConn.openConnection(); 
	let data = "";
	con.query('SELECT * FROM template where is_delete=0',function(err,rows){
	  if(err) throw err;

	  console.log("getAllTemplates:" + rows);
	  data = rows.map(row => { 
	    console.log(row);
		return { id: row.id, name: row.name}
	  });
	  
	  dbConn.closeConnection(con);
	  return res.json(data); 
	});  
	

},
getAllCategories: function(res)
{ 
	const con = dbConn.openConnection(); 
	let data = "";
	con.query('SELECT * FROM category where is_delete=0',function(err,rows){
	  if(err) throw err;

	  console.log(rows);
	  data = rows.map(row => { 
		return { id: row.id, name: row.name}
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
		console.log(dataReceived);
		var updateDBfield  = {
		  name: dataReceived["name"],
		  salt_id: dataReceived["saltId"],
		 // template_id: dataReceived["templateId"],
		  category_id: dataReceived["groupId"]
		}; 
		
		const con = dbConn.openConnection(); 

		con.query('INSERT INTO codmgr2.store SET ?', updateDBfield, function(err, result) {
			
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
		const con = dbConn.openConnection(); 
 
		con.query('UPDATE codmgr2.store SET name=?, salt_id=?, category_id=? WHERE id=?', [dataReceived["name"],dataReceived["saltId"],dataReceived["groupId"],dataReceived["id"]], function(err, result) {
		//con.query('UPDATE codmgr2.store SET name=?, salt_id=?, template_id=?, category_id=? WHERE id=?', [dataReceived["name"],dataReceived["saltId"],dataReceived["templateId"],dataReceived["groupId"],dataReceived["id"]], function(err, result) {
			 
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
 
		con.query('UPDATE codmgr2.store SET is_delete=1 WHERE id=?', dataReceived["id"], function(err, result) {
			 
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