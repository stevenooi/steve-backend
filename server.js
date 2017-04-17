// server.js

const express = require('express');
const app = express(); 
const cors = require('cors');
const mysql = require("mysql");
const fs = require('fs'); 
//var logger = new winston.Logger();

var http = require('http');
var https = require('https');
var querystring = require('querystring');

var fileUpload = require('express-fileupload');

var ApiSettings = require('./config/apiSettings'); 
var SecuritySettings = require('./config/securitySettings');
var user = require('./mysql_functions/userDB');
var template = require('./mysql_functions/templateDB');
var progress = require('./mysql_functions/progressDB');

var logger = require('./utils/custom_logger');  

app.use(fileUpload()); 

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', SecuritySettings.ACCESS_CONTROL_ALLOW_ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true); 
    next();
});

var menu = [
   
  {
    id: 2,
    name: 'User', 
    path: 'user', 
  },  
  {
    id: 6,
    name: 'Template', 
    path: 'templateform', 
  },
  {
    id: 7,
    name: 'Apply Template', 
    path: 'progress', 
 } 
];
 
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

app.post('/api/uploadimage', (req, res) => 
{ 
if (!req.files) {
    res.send('No files were uploaded.');
    return;
  } 
  
  var newFile = req.files.file;
  var newUUID = guid();
  	
  newFile.mv(ApiSettings.MOUNT_DRIVE_PATH + 'images/' + newUUID + '.jpg', function(err) {
    if (err) {
		console.log("file upload error :"  + err);
      res.status(500).send(err);
    }
    else { 
      res.send(newUUID);
    }
  });
  
  
});
      
app.post('/api/login', (req, res) => {  
	//console.log("login api accessed");
	user.verifyLogin(req,res); 
});
  
app.post('/api/adduser', (req, res) => {  
	//console.log("adduser api accessed");
	user.addData(req,res); 
});

app.post('/api/edituser', (req, res) => { 
	//console.log("edituser api accessed");
	user.editData(req,res); 
});

app.post('/api/deleteuser', (req, res) => { 
	//console.log("deleteuser api accessed");
	user.deleteData(req,res); 
});

app.post('/api/user', (req, res) => {
	//logger.info(req,"user api accessed");
	//console.log("user api accessed");
	user.getUserData(req,res); 
});
 
app.get('/api/user/:id', (req, res) => { 
	//console.log("user id api accessed"); 
	user.getUserDataById(res,req.params.id); 
});
     
app.get('/api/retrieveimage/:filename', (req, res) => { 
     var img = fs.readFileSync(ApiSettings.MOUNT_DRIVE_PATH + 'images/' + req.params.filename);
     res.writeHead(200, {'Content-Type': 'image/jpeg' });
     res.end(img, 'binary');
	   
});

app.post('/api/progress', (req, res) => {
	//console.log("progress api accessed");
	progress.getProgressData(req,res); 
});

app.post('/api/updateprogress', (req, res) => {
	//console.log("updateprogress api accessed"); 	 
	progress.updateData(req,res);
});
 

//----------------------------------------------------------------------

app.post('/api/menu', (req, res) => 
{  
	let dataReceived = "";
	req.on('data', function (data) {
		dataReceived += data; 
	
	}); 
	req.on('end', function () { 
		dataReceived = JSON.parse(dataReceived); 
		let returnObj = null;
		 
			returnObj = menu.map(menu => { 
				return { id: menu.id, name: menu.name, path: menu.path}
			});
		res.json(returnObj);

	});
});


app.post('/api/template', (req, res) => { 
	template.getAllTemplates(req,res); 
});


  
var httpServer = http.createServer(app);
httpServer.listen(3001);

console.log('Listening on https://localhost:3001');