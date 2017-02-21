// server.js

const express = require('express');
const app = express(); 
const cors = require('cors');
const mysql = require("mysql");
const fs = require('fs');
var http = require('http');
var querystring = require('querystring');

var fileUpload = require('express-fileupload');

var test = require('./mysql_functions/testDB');
var role = require('./mysql_functions/roleDB');
var store = require('./mysql_functions/storeDB');
var template = require('./mysql_functions/templateDB');
var group = require('./mysql_functions/groupDB');
var progress = require('./mysql_functions/progressDB');
var rmsHandlerAPI = require('./rms_functions/rmsHandlerAPI');

app.use(cors());
app.use(fileUpload());

var menu = [
  
  {
    id: 1,
    name: 'Role', 
    path: 'role', 
  },
  {
    id: 2,
    name: 'Store', 
    path: 'store', 
  },
  {
    id: 3,
    name: 'Template', 
    path: 'template', 
  },
  {
    id: 4,
    name: 'Group', 
    path: 'group', 
  },
  {
    id: 5,
    name: 'Apply Template', 
    path: 'progress', 
 }/*,
  {
    id: 5,
    name: 'Image Picker (Test)', 
    path: 'page1', 
 }*/
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
console.log(" in uploadimage 1");
  if (!req.files) {
    res.send('No files were uploaded.');
    return;
  } 
  
  var newFile = req.files.file;
  var newUUID = guid();
  // Use the mv() method to place the file somewhere on your server 
  //newFile.mv('c:/temp/' + newUUID + '.jpg', function(err) {
  //newFile.mv('f:/images/' + newUUID + '.jpg', function(err) { 
	
  newFile.mv('f:/images/' + newUUID + '.jpg', function(err) {
    if (err) {
		console.log("file upload error :"  + err);
      res.status(500).send(err);
    }
    else {
		console.log("file upload completed:" + newUUID);
      res.send(newUUID);
    }
  });
  
console.log(" in uploadimage 3");
});


app.post('/api/addrole', (req, res) => {
	console.log("addrole1");  
	role.addData(req,res);
	console.log("addrole2"); 
});

app.post('/api/editrole', (req, res) => { 
	console.log("editrole api accessed");
	role.editData(req,res); 
});

app.post('/api/deleterole', (req, res) => { 
	console.log("deleterole api accessed");
	role.deleteData(req,res); 
});

app.get('/api/role', (req, res) => {
	console.log("role api accessed");
	role.getRoleData(res); 
});
 
app.get('/api/role/:id', (req, res) => { 
	console.log("role id api accessed"); 
	role.getRoleDataById(res,req.params.id); 
});

 

app.post('/api/addstore', (req, res) => { 
	store.addData(req,res); 
});

app.post('/api/editstore', (req, res) => { 
	console.log("editstore api accessed");
	store.editData(req,res); 
});

app.post('/api/deletestore', (req, res) => { 
	console.log("deletestore api accessed");
	store.deleteData(req,res); 
});
 

app.get('/api/store', (req, res) => {
	console.log("store api accessed");
	store.getStoreData(res); 
});
 
app.get('/api/store/:id', (req, res) => { 
	console.log("store id api accessed"); 
	store.getStoreDataById(res,req.params.id); 
});


app.get('/api/template/:id', (req, res) => { 
	console.log("template id api accessed"); 
	template.getTemplateDataById(res,req.params.id); 
});

app.get('/api/templateslide/:id', (req, res) => { 
	console.log("template id api accessed"); 
	template.getTemplateSlidesById(res,req.params.id); 
});

 

app.get('/api/templateactive', (req, res) => {
	console.log("templateactive api accessed");
	template.getAllActiveTemplates(res); 
});

app.get('/api/template', (req, res) => {
	console.log("template api accessed");
	template.getAllTemplates(res); 
});

app.post('/api/addtemplate', (req, res) => {
	
	console.log("addtemplate api accessed"); 
	
	template.addData(req,res);
	/*
	var dataReceived = "";
	req.on('data', function (data) {
		dataReceived += data; 
		console.log("data:" + data);
	}); 
	req.on('end', function () {
		dataReceived = JSON.parse(dataReceived);
		console.log("dataReceived:" + dataReceived);
		console.log("dataReceived.rmsData:" + JSON.stringify(dataReceived.rmsData));
	//	callRMS(dataReceived.rmsData);
		//res.json("success");
	});
	 */
      
});

app.post('/api/edittemplate', (req, res) => {
	
	console.log("edittemplate api accessed"); 
	/*
	var dataReceived = "";
	req.on('data', function (data) {
		dataReceived += data; 
		console.log("data:" + data);
	}); 
	req.on('end', function () {
		dataReceived = JSON.parse(dataReceived);
		console.log("dataReceived:" + dataReceived);
		console.log("dataReceived.rmsData:" + JSON.stringify(dataReceived.rmsData));
		
		
		//get id
		//update slides
			//delete old slides
			//create new slides
		//update template
		
		//callRMS(dataReceived.rmsData);
		res.json("success");
	});
	*/
	 
	template.editData(req,res);
      
});

app.get('/api/retrieveimage/:filename', (req, res) => {
	console.log("retrieveimage api accessed");
     var img = fs.readFileSync('f:\\images\\' + req.params.filename);
     res.writeHead(200, {'Content-Type': 'image/jpeg' });
     res.end(img, 'binary');
	   
});

app.post('/api/addgroup', (req, res) => { 
	group.addData(req,res); 
});

app.get('/api/group', (req, res) => {
	console.log("group api accessed");
	//store.getAllCategories(res); 
	group.getGroupData(res); 
});

app.get('/api/group/:id', (req, res) => { 
	console.log("store id api accessed"); 
	group.getGroupDataById(res,req.params.id); 
});

app.get('/api/groupexceptself/:id', (req, res) => { 
	console.log("groupexceptself api accessed"); 
	group.getAllGroupExceptSelf(res,req.params.id); 
});

app.post('/api/editgroup', (req, res) => { 
	console.log("editgroup api accessed");
	group.editData(req,res); 
});

app.get('/api/companylist', (req, res) => {
	console.log("companylist api accessed");
	//store.getAllCategories(res); 
	group.getCompanyListData(res); 
});

app.post('/api/deletegroup', (req, res) => { 
	console.log("deletegroup api accessed");
	group.deleteData(req,res); 
});

app.get('/api/progress', (req, res) => {
	console.log("progress api accessed");
	progress.getProgressData(res); 
});

app.post('/api/updateprogress', (req, res) => {
	console.log("updateprogress api accessed"); 	 
	progress.updateData(req,res);
});

app.get('/api/testmicro', (req, res) => {
	console.log("testmicro api accessed");
	
	var post_data = JSON.stringify({
		'compilation_level' : 'ADVANCED_OPTIMIZATIONS',
		'output_format': 'json',
		'output_info': 'compiled_code',
		'warning_level' : 'QUIET',
		'js_code' : 'testing..'
	});

	rmsHandlerAPI.callRmsHandler(post_data);
	
	res.json("success");
});

function callRMS(data)
{
	 
var W3CWebSocket = require('websocket').w3cwebsocket;
 
var client = new W3CWebSocket('ws://192.168.3.125:9090/ws', 'echo-protocol');
 
client.onerror = function() {
    console.log('Connection Error');
};
 
client.onopen = function() {
    console.log('WebSocket Client Connected');
 
    function sendToRMS() {
        if (client.readyState === client.OPEN) {
            var number = Math.round(Math.random() * 0xFFFFFF);
            //client.send("{\"cmd\":\"ping\",\"target\":[\"vagrant-ubuntu-trusty-64\"]}");
			// client.send("{\"cmd\":\"codupdate\",\"target\":[\"SI-BOGON-VIC.summit.local\",\"SI-SHAUN-NUC\"],\"params\":{ \"ImgPath\":\"/images/\",\"Welcome\":\"SI-Welcome.jpg\",\"ThankYou\":\"SI-ThankYou.jpg\",\"Logo\":\"logo.jpg\",\"Default1\":\"SI-Slides1.jpg\",\"Default2\":\"SI-Slides1.jpg\",\"Schedules\":{ \"SlidesDisplay\":\"1\",\"SlideID\":\"0\",\"Interval\":\"5\",\"SlidesInfo\":[ { \"total\":\"4\",\"slides\":[ \"SI-Slides1.jpg\",\"SI-Slides2.jpg\",\"SI-Slides4.jpg\",\"SI-Slides5.jpg\"]},{\"total\":\"2\",\"slides\":[ \"SI-Slides1.jpg\",\"SI-Slides5.jpg\"]}]}}}");
			client.send(JSON.stringify(data));
			//setTimeout(sendNumber, 1000);
			
        }
    }
    sendToRMS();
	
	
}
client.onclose = function() {
    console.log('echo-protocol Client Closed');
};
 
client.onmessage = function(e) {
    if (typeof e.data === 'string') {
        console.log("Received: '" + e.data + "'");
    }
};


}

app.get('/api/test', (req, res) => {
	
	console.log("XXX");
	/*
	
var WebSocketClient = require('websocket').client;
 
var client = new WebSocketClient();
 
client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});


client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });
    
    function sendNumber() {
        if (connection.connected) {
            var number = Math.round(Math.random() * 0xFFFFFF);
            connection.sendUTF(number.toString());
            setTimeout(sendNumber, 1000);
        }
    }
    sendNumber();
});
 
//client.connect('ws://192.168.3.125:9090/ws', 'echo-protocol');
 
var W3CWebSocket = require('websocket').w3cwebsocket;
 
var client = new W3CWebSocket('ws://192.168.3.125:9090/ws', 'echo-protocol');
 
client.onerror = function() {
    console.log('Connection Error');
};
 
client.onopen = function() {
    console.log('WebSocket Client Connected');
 
    function sendNumber() {
        if (client.readyState === client.OPEN) {
            var number = Math.round(Math.random() * 0xFFFFFF);
            //client.send(number.toString());
            //client.send("{\"cmd\":\"ping\",\"target\":[\"vagrant-ubuntu-trusty-64\"]}");
			 client.send("{\"cmd\":\"codupdate\",\"target\":[\"SI-BOGON-VIC.summit.local\",\"SI-SHAUN-NUC\"],\"params\":{ \"ImgPath\":\"/images/\",\"Welcome\":\"SI-Welcome.jpg\",\"ThankYou\":\"SI-ThankYou.jpg\",\"Logo\":\"logo.jpg\",\"Default1\":\"SI-Slides1.jpg\",\"Default2\":\"SI-Slides1.jpg\",\"Schedules\":{ \"SlidesDisplay\":\"1\",\"SlideID\":\"0\",\"Interval\":\"5\",\"SlidesInfo\":[ { \"total\":\"4\",\"slides\":[ \"SI-Slides1.jpg\",\"SI-Slides2.jpg\",\"SI-Slides4.jpg\",\"SI-Slides5.jpg\"]},{\"total\":\"2\",\"slides\":[ \"SI-Slides1.jpg\",\"SI-Slides5.jpg\"]}]}}}");
			//setTimeout(sendNumber, 1000);
			
        }
    }
    sendNumber();
	
};
 
client.onclose = function() {
    console.log('echo-protocol Client Closed');
};
 
client.onmessage = function(e) {
    if (typeof e.data === 'string') {
        console.log("Received: '" + e.data + "'");
    }
};


 // test.testGetAllEmployee(res);
	  console.log("hereX2"); 
	  */
	  
	callRMS();
  res.json("success");
});


app.get('/api/menu', (req, res) => {
  const allContacts = menu.map(menu => { 
    return { id: menu.id, name: menu.name, path: menu.path}
  });
  res.json(allContacts);
});

app.get('api/testws',(req,res) => {

  res.json("aa");
console.log("here");
});


app.listen(3001);
console.log('Listening on http://localhost:3001');