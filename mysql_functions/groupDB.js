const mysql = require("mysql");

var dbConn = require('./../config/db_conn');
 
module.exports = 
{

getGroupData: function(res)
{ 
	const con = dbConn.openConnection();

	let data = "";
	con.query('select g.id,g.name,g4.child_count,g5.store_count,g2.name as parent_name,c.name as company_name from category g inner join company c on c.id = g.company_id left join category g2 on g.parent_id = g2.id LEFT JOIN (select parent_id,count(*) as child_count from category group by parent_id) g4 on g4.parent_id = g.id LEFT JOIN (select category_id,count(*) as store_count from store group by category_id) g5 on g5.category_id = g.id where g.is_delete=0',function(err,rows){
	  if(err) throw err;
 
	  data = rows.map(row => { 
		return { id: row.id, name: row.name, parentName: row.parent_name, companyName: row.company_name ,childCount: row.child_count , storeCount: row.store_count}
	  });
	  
	  dbConn.closeConnection(con);
	  return res.json(data); 
	});  
},

getCompanyListData: function(res)
{ 
	const con = dbConn.openConnection();

	let data = "";
	con.query('select c.id,c.name from company c where c.is_delete=0',function(err,rows){
	  if(err) throw err;
 
	  data = rows.map(row => { 
		return { id: row.id, name: row.name}
	  });
	  
	  dbConn.closeConnection(con);
	  return res.json(data); 
	});  
},


getAllGroupExceptSelf: function(res,id)
{ 
	const con = dbConn.openConnection(); 
	let data = "";
	con.query('SELECT * FROM category WHERE id !=? AND is_delete=0',id,function(err,rows){
	    if(err) throw err;

	  console.log(rows);
	  data = rows.map(row => { 
		return { id: row.id, name: row.name}
	  });
	  
	  dbConn.closeConnection(con);
	  return res.json(data); 
	});  
	

},

getGroupDataById: function(res,id)
{ 
	const con = dbConn.openConnection(); 
	let data = "";
	con.query('SELECT * FROM category WHERE id=?',id,function(err,rows){
	//con.query('SELECT * FROM store where is_delete=0 and id=?',id,function(err,rows){
	//con.query('SELECT s.* FROM codmgr2.store s LEFT JOIN codmgr2.template t ON t.id=s.template_id LEFT JOIN codmgr2.category c ON c.id=s.category_id where s.is_delete=0 and s.id=?',id,function(err,rows){
	    if(err) throw err;

	  console.log(rows);
	  data = rows.map(row => { 
		return { id: row.id, name: row.name, parentId: row.parent_id, companyId: row.company_id}
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
		  parent_id: dataReceived["parentId"], 
		  company_id: dataReceived["companyId"]
		}; 
		
		const con = dbConn.openConnection(); 

		con.query('INSERT INTO codmgr2.category SET ?', updateDBfield, function(err, result) {
			
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
 
		con.query('UPDATE codmgr2.category SET name=?, parent_id=?, company_id=? WHERE id=?', [dataReceived["name"],dataReceived["parentId"],dataReceived["companyId"],dataReceived["id"]], function(err, result) {
			 
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
 
		con.query('UPDATE codmgr2.category SET is_delete=1 WHERE id=?', dataReceived["id"], function(err, result) {
			 
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