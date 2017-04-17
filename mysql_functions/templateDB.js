const mysql = require("mysql");

var dbConn = require('./../config/db_conn');
var errorHandler = require('./../utils/error_handler'); 
var logger = require('./../utils/custom_logger'); 

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
	 return dataObj;
}

module.exports = 
{

getTemplateData: function(res)
{ 
	const con = dbConn.openConnection();

	let data = "";
	con.query('SELECT * FROM template where is_delete=0',function(err,rows){
	
	if(err) return errorHandler.generateErrorMessage(err,res);
	   
	  data = rows.map(row => { 
		return { id: row.id, name: row.name, description: row.description, welcome: row.welcome, logo: row.logo, thankyou: row.thankyou, default1: row.default1, default2: row.default2}
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
	 if(err) return errorHandler.generateErrorMessage(err,res);
	     
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
	 if(err) return errorHandler.generateErrorMessage(err,res);
	   
	  data = rows.map(row => { 
			return { id: row.id, name: row.image_filename};
	  });
	  
	  dbConn.closeConnection(con);
	  
	  return res.json(data); 
	});  
	

},
getAllActiveTemplates: function(req,res)
{ 
	var dataReceived = "";
	req.on('data', function (data) {
		dataReceived += data;  
	}); 
	req.on('end', function () {		
		dataReceived = JSON.parse(dataReceived);
		const con = dbConn.openConnection(); 
		let data = "";
		console.log("[dataReceived[\"reqcompanyid\"]]:"+ [dataReceived["reqcompanyid"]]);
		con.query("SELECT * FROM template where is_delete=0 and (status='ACTIVE' or status='DEPLOYED') and company_id=?",[dataReceived["reqcompanyid"]],function(err,rows){
		 if(err) return errorHandler.generateErrorMessage(err,res);
			 
		  //console.log("getAllTemplates:" + rows);
		  data = rows.map(row => { 
			//console.log(row);
			return { id: row.id, name: row.name, status: row.status}
		  });
		  
		  dbConn.closeConnection(con);
		  return res.json(data); 
		});  
	});  
	

}, 
getAllTemplates: function(req,res)
{ 
	var dataReceived = "";
	req.on('data', function (data) {
		dataReceived += data;  
	}); 
	req.on('end', function () {		
		dataReceived = JSON.parse(dataReceived);
			
		const con = dbConn.openConnection(); 
		let data = "";
		con.query('SELECT t.* FROM template t where t.is_delete=0',function(err,rows){
		  if(err) return errorHandler.generateErrorMessage(err,res);
		  
		  data = rows.map(row => { 
			return { id: row.id, name: row.name, description: row.description, status: row.status, welcome: row.welcome, logo: row.logo, thankyou: row.thankyou, default1: row.default1, default2: row.default2}
		  });
		  
		  dbConn.closeConnection(con);
		  return res.json(data); 
		});  
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
		  name: dataReceived["name"],
		  description: dataReceived["description"] ,
		  welcome: dataReceived["welcome"] ,
		  thankyou: dataReceived["thankyou"] ,
		  logo: dataReceived["logo"] ,
		  default1: dataReceived["default1"] ,
		  default2: dataReceived["default2"] ,
		  status: dataReceived["status"] ,
		  company_id: dataReceived["companyId"] 
		}; 
		
		console.log(JSON.stringify(updateDBfield));
		
		var rmsObj = generateRMSObject(dataReceived);
		
		const con = dbConn.openConnection(); 

		con.query('INSERT INTO template SET ?', updateDBfield, function(err, result) {
			if(err) return errorHandler.generateErrorMessage(err,res);
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
  
	dataReceived["slideImg"].map(slideRow => {  
			
			let con2 = dbConn.openConnection();
			con2.query('INSERT INTO slide SET template_id=?, image_filepath=?,image_filename=?', [lastId,"F:/images",slideRow], function(err, result) {
			if(err) 
			{
				console.error ("err.message:" + err.message  + "result: " + result) ;
				 if(err) return errorHandler.generateErrorMessage(err,res);
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
	  
	
		dbConn.closeConnection(con);
		
		
	});
	
},

editData: function(req,res)
{ 
	var dataReceived = "";
	req.on('data', function (data) {
		dataReceived += data; 
	}); 
	req.on('end', function () { 
		dataReceived = JSON.parse(dataReceived);   
		let con = dbConn.openConnection(); 
		
		var tempId = dataReceived.id;
		
		var tempName = dataReceived.name;
		
		var tempDescription = dataReceived.description;
		
		var tempWelcome = dataReceived.welcome;
		
		var tempThankYou = dataReceived.thankyou;
		
		var tempLogo = dataReceived.logo;
		
		var tempDefault1 = dataReceived.default1;
		
		var tempDefault2 = dataReceived.default2;
		
		con.query('UPDATE template SET name=?, description=?, welcome=?,thankyou=?,logo=?,default1=?,default2=?,status=? WHERE id=?', [dataReceived["name"],dataReceived["description"],dataReceived["welcome"],dataReceived["thankyou"],dataReceived["logo"],dataReceived["default1"],dataReceived["default2"],dataReceived["status"],dataReceived["id"]], function(err, result) {
		 dbConn.closeConnection(con);
			if(err) return errorHandler.generateErrorMessage(err,res);
			else{  
				//return res.json("success"); 
			}
		});
		
		con = dbConn.openConnection();  
		con.query('UPDATE slide SET is_delete=1 WHERE template_id=?', dataReceived["id"], function(err, result) {
		 dbConn.closeConnection(con);
			 if(err) return errorHandler.generateErrorMessage(err,res);
			 else{ 
				//return res.json("success"); 
				
		 
				 var slideImgData = dataReceived["slideImg"];
				 //var slideImgData = slideImgDataReceived.split(","); 

				let con2 = dbConn.openConnection();  
				slideImgData.map(slideRow => {  

				con2.query('INSERT INTO slide SET template_id=?, image_filepath=?,image_filename=?', [dataReceived["id"],"F:/images",slideRow], function(err, result) {

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
		
		var message = "Edit Template [name:" + dataReceived["name"] + ",description:" + dataReceived["description"] + ",welcome:" + dataReceived["welcome"] + ",thankyou:" + dataReceived["thankyou"] + ",logo:" + dataReceived["logo"] + ",default1:" + dataReceived["default1"] + ",default2:" + dataReceived["default2"] + ",status:" + dataReceived["status"] + ",slides:" + dataReceived["slideImg"] + "]";
		logger.info(dataReceived, message,req);

		return res.json("success"); 
			  
			  
	});
	
},

deleteData: function(req,res)
{ 
	var dataReceived = "";
	req.on('data', function (data) {
		dataReceived += data; 
	}); 
	req.on('end', function () { 
		dataReceived = JSON.parse(dataReceived); 
		
		const con = dbConn.openConnection(); 
 
		con.query('UPDATE template SET is_delete=1 WHERE id=?', dataReceived["id"], function(err, result) {
			 
			dbConn.closeConnection(con);
			if(err) return errorHandler.generateErrorMessage(err,res);
			else{ 
			
				var message = "Delete Template [id:" + dataReceived["id"] + "]";
				logger.info(dataReceived, message,req);

				return res.json("success"); 
			}
		});
	});
	
}



};