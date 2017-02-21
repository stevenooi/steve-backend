const mysql = require("mysql");

var dbConn = require('./../config/db_conn');

module.exports = 
{


testGetAllEmployee: function(res)
{ 
	const con = dbConn.openConnection();

	let data = "";
	con.query('SELECT * FROM test',function(err,rows){
	  if(err) throw err;

	  console.log('Data received from Db:\n');
	  console.log(rows);
	  data = rows.map(row => { 
		return { id: row.id, name: row.name, location: row.location}
	  });
	  con.end();
	  return res.json(data); 
	});  
}
};