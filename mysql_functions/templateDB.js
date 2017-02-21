const mysql = require("mysql");

var dbConn = require('./../config/db_conn');
var rmsAPI = require('./../rms_functions/rmsAPI');
 
 
function generateRMSObject(dataReceived)
{
	let dataObj = {};
	 dataObj.cmd = "codupdate";
	 //dataObj.target = ["SI-BOGON-VIC.summit.local"];
	 dataObj.target = dataReceived["target"];
	 let dataObjParams = {};
	 dataObjParams.ImgPath = "/images/";
	 dataObjParams.Welcome = dataReceived["welcome"];
	 dataObjParams.ThankYou = dataReceived["thankyou"];
	 dataObjParams.Logo = dataReceived["logo"];
	 dataObjParams.Default1 = dataReceived["default1"];
	 dataObjParams.Default2 = dataReceived["default2"];
	 dataObj.params = dataObjParams;
	 let dataObjSchedules = {};
	 dataObjSchedules.SlidesDisplay = "1";
	 dataObjSchedules.SlideID = "0";
	 dataObjSchedules.Interval = "5";
	 dataObj.params.Schedules = dataObjSchedules;
	 let dataObjSlidesInfoArray = [];
	 let dataObjSlidesInfo = {};
	 dataObjSlidesInfo.total = "2";
	 let dataObjSlidesInfoSlides = [];
	 dataObjSlidesInfoSlides.push("SI-Slides1.jpg");
	 dataObjSlidesInfoSlides.push("SI-Slides2.jpg");
	 dataObjSlidesInfo.slides = dataObjSlidesInfoSlides;
	 dataObjSlidesInfoArray.push(dataObjSlidesInfo);
	 
	 dataObj.params.Schedules.SlidesInfo = dataObjSlidesInfoArray;
	 console.log("dataObj:" + dataObj);
	 return dataObj;
}

module.exports = 
{

getTemplateData: function(res)
{ 
	const con = dbConn.openConnection();

	let data = "";
	con.query('SELECT * FROM template where is_delete=0',function(err,rows){
	  if(err) throw err;

	 // console.log(rows);
	  data = rows.map(row => { 
		return { id: row.id, name: row.name, description: row.description}
	  });
	  
	  dbConn.closeConnection(con);
	  return res.json(data); 
	});  
},

getTemplateDataById: function(res,id)
{ 
	const con = dbConn.openConnection(); 
	let data = "";
	let slides = "";
	con.query('SELECT * FROM template where id=?',id,function(err,rows){
	 if(err) throw err;

	  data = rows.map(row => { 
	   
			return { id: row.id, name: row.name, description: row.description, welcome: row.welcome, logo: row.logo, thankyou: row.thankyou, default1: row.default1, default2: row.default2};
	  });
	  
	  dbConn.closeConnection(con);
	  
	//  console.log(data);
	  return res.json(data); 
	});  
	

},

getTemplateSlidesById: function(res,id)
{ 
	const con = dbConn.openConnection(); 
	let data = "";
	let slides = "";
	con.query('SELECT * FROM slide where template_id=? and is_delete=0',id,function(err,rows){
	 if(err) throw err;

	  data = rows.map(row => { 
			return { id: row.id, name: row.image_filename};
	  });
	  
	  dbConn.closeConnection(con);
	  
	  console.log(data);
	  return res.json(data); 
	});  
	

},
getAllActiveTemplates: function(res)
{ 
	const con = dbConn.openConnection(); 
	let data = "";
	con.query("SELECT * FROM template where is_delete=0 and status='ACTIVE'",function(err,rows){
	  if(err) throw err;

	  //console.log("getAllTemplates:" + rows);
	  data = rows.map(row => { 
	    //console.log(row);
		return { id: row.id, name: row.name, status: row.status}
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

	  //console.log("getAllTemplates:" + rows);
	  data = rows.map(row => { 
	    //console.log(row);
		return { id: row.id, name: row.name, status: row.status}
	  });
	  
	  dbConn.closeConnection(con);
	  return res.json(data); 
	});  
	

}, 
addData: function(req,res)
{ 
		console.log("add data accessed");
	var dataReceived = "";
	req.on('data', function (data) {
		console.log("add data accessed 2");
		dataReceived += data; 
		console.log("add data - received data");
	}); 
	req.on('end', function () {
		console.log("add data 1");
		dataReceived = JSON.parse(dataReceived);
		console.log(dataReceived);
		 
		if(dataReceived["slideImg"][0] != null)
		{
			console.log("slideImg[0]:" + dataReceived["slideImg"][0]);
		}
		if(dataReceived["slideImg"][1] != null)
		{
			console.log("slideImg[1]:" + dataReceived["slideImg"][1]);
		}
		var updateDBfield  = {
		  name: dataReceived["name"],
		  description: dataReceived["description"] ,
		  welcome: dataReceived["welcome"] ,
		  thankyou: dataReceived["thankyou"] ,
		  logo: dataReceived["logo"] ,
		  default1: dataReceived["default1"] ,
		  default2: dataReceived["default2"] ,
		  status: dataReceived["status"] 
		}; 
		
		console.log("add data 2");
		var rmsObj = generateRMSObject(dataReceived);
		
		const con = dbConn.openConnection(); 

		con.query('INSERT INTO codmgr2.template SET ?', updateDBfield, function(err, result) {
		console.log("add data 3");
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

    let lastId = "";		
	con.query('SELECT max(id) as lastid FROM template',function(err,rows){
	  if(err) throw err;
 
	  lastId = rows.map(row => {  
		return row.lastid;
	  }); 
 
 //console.log("dataReceived[\"slideImg\"]:" + dataReceived["slideImg"]);
			dataReceived["slideImg"].map(slideRow => {  
			
				let con2 = dbConn.openConnection();
				con2.query('INSERT INTO codmgr2.slide SET template_id=?, image_filepath=?,image_filename=?', [lastId,"F:/images",slideRow], function(err, result) {
				console.log("add data 5");
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
					//	return res.json("success"); 
					}
				}); 
				
		dbConn.closeConnection(con2);
			  });
			  
	});  
	
	
		rmsAPI.callRMS(rmsObj);
		
	
		dbConn.closeConnection(con);
		
		
	});
	
},

editData: function(req,res)
{ 
console.log("template edit accessed");
	var dataReceived = "";
	req.on('data', function (data) {
		dataReceived += data; 
		console.log(data);
	}); 
	req.on('end', function () { 
		dataReceived = JSON.parse(dataReceived);   
		let con = dbConn.openConnection(); 
		
		var tempId = dataReceived.id;
		console.log("tempId:"+ tempId);
		var tempName = dataReceived.name;
		console.log("tempName:"+ tempName);
		var tempDescription = dataReceived.description;
		console.log("tempDescription:"+ tempDescription);
		var tempWelcome = dataReceived.welcome;
		console.log("welcome:"+ tempWelcome);
		
		var tempThankYou = dataReceived.thankyou;
		console.log("ThankYou:"+ tempThankYou);
		
		var tempLogo = dataReceived.logo;
		console.log("tempLogo:"+ tempLogo);
		
		var tempDefault1 = dataReceived.default1;
		console.log("tempDefault1:"+ tempDefault1);
		
		var tempDefault2 = dataReceived.default2;
		console.log("tempDefault2:"+ tempDefault2);
		console.log("slideImg:"+ dataReceived.slideImg);
		console.log("dataReceived['status']:" + dataReceived["status"]);
		
		con.query('UPDATE codmgr2.template SET name=?, description=?, welcome=?,thankyou=?,logo=?,default1=?,default2=?,status=? WHERE id=?', [dataReceived["name"],dataReceived["description"],dataReceived["welcome"],dataReceived["thankyou"],dataReceived["logo"],dataReceived["default1"],dataReceived["default2"],dataReceived["status"],dataReceived["id"]], function(err, result) {
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
				console.log("update success");
				//return res.json("success"); 
			}
		});
		
		con = dbConn.openConnection();  
		con.query('UPDATE codmgr2.slide SET is_delete=1 WHERE template_id=?', dataReceived["id"], function(err, result) {
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
				//return res.json("success"); 
				
		 
				 var slideImgData = dataReceived["slideImg"];
				 //var slideImgData = slideImgDataReceived.split(","); 

				let con2 = dbConn.openConnection();  
				slideImgData.map(slideRow => {  

				console.log("attempt to insert slide -slideRow : "  + slideRow + ", id:" + dataReceived["id"]);
				con2.query('INSERT INTO codmgr2.slide SET template_id=?, image_filepath=?,image_filename=?', [dataReceived["id"],"F:/images",slideRow], function(err, result) {

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
				console.log("insert slide successful :" + slideRow);
				//return res.json("success"); 
				}
				}); 

				});

				dbConn.closeConnection(con2);
			}
		});
			  return res.json("success"); 
			  
			  
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
 
		con.query('UPDATE codmgr2.template SET is_delete=1 WHERE id=?', dataReceived["id"], function(err, result) {
			 
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