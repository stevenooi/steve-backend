// server.js

const express = require('express');
const app = express(); 
const cors = require('cors');
const mysql = require("mysql");

app.use(cors());


var menu = [
  {
    id: 1,
    name: 'Page 1', 
  },
  {
    id: 2,
    name: 'Page 2', 
  },
  {
    id: 3,
    name: 'Page 3', 
  },
  {
    id: 4,
    name: 'Page 4', 
  },
  {
    id: 5,
    name: 'Page 5', 
  }
];

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "codmgr2"
});

function openDbConn()
{ 
	con.connect(function(err){
	  if(err){
		console.log('Error connecting to Db');
		return;
	  }
	  console.log('Connection established');
	});
}
function closeDbConn()
{ 
	con.end(function(err) {
	  // The connection is terminated gracefully
	  // Ensures all previously enqueued queries are still
	  // before sending a COM_QUIT packet to the MySQL server.
	});
}

testGetAllEmployee = function(res)
{ 
	let data = "";
	con.query('SELECT * FROM test',function(err,rows){
	  if(err) throw err;

	  console.log('Data received from Db:\n');
	  console.log(rows);
	  data = rows.map(row => { 
		return { id: row.id, name: row.name, location: row.location}
	  });
	  
	  return res.json(data); 
	});  
}

function getAllEmployee()
{
	let data = "";
	con.query('SELECT * FROM test',function(err,rows){
	  if(err) throw err;
 
	  console.log(rows);
	  return rows;
	  data = rows.map(row => { 
		return { id: row.id, name: row.name}
	  }); 
	});   
}

openDbConn();

app.get('/api/test', (req, res) => {
	  console.log("hereX1");
  testGetAllEmployee(res);
	  console.log("hereX2"); 
});


app.get('/api/menu', (req, res) => {
  const allContacts = menu.map(menu => { 
    return { id: menu.id, name: menu.name}
  });
  res.json(allContacts);
});

app.listen(3001);
console.log('Listening on http://localhost:3001');