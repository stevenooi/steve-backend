const mysql = require("mysql");

var dbConn = require('./../config/db_conn');
//var rmsAPI = require('./../rms_functions/rmsAPI');

var rmsHandlerAPI = require('./../rms_functions/rmsHandlerAPI');

function generateRMSObject(welcome, thankyou, logo, default1, default2,slide1,slide2, target)
{
	let dataObj = {};
	 dataObj.cmd = "codupdate";
	 //dataObj.target = ["SI-BOGON-VIC.summit.local"];
	 dataObj.target = target;
	 let dataObjParams = {};
	 dataObjParams.ImgPath = "images";
	 dataObjParams.Welcome = welcome;
	 dataObjParams.ThankYou = thankyou;
	 dataObjParams.Logo = logo;
	 dataObjParams.Default1 = default1;
	 dataObjParams.Default2 = default2;
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

getProgressData: function(res)
{ 
	const con = dbConn.openConnection();

	let data = "";
	let sql = "select c.id, 'group' as list_type,'0' as stage1,'0' as stage2,'0' as stage3,'0' as stage4,'0' as stage5,'0' as stage6, c.name, 'progress','no_template' as template_list,'' as template_name,c.parent_id as parent_id, c.id as order_list from category c where c.is_delete=0 union select s.id, 'store' as list_type,s.stage1, s.stage2, s.stage3, s.stage4, s.stage5, s.stage6, s.name, 'progress',s.template_id as template_list,t1.name as template_name, s.category_id as parent_id, s.category_id  as order_list from store s left join template t1 ON t1.id = s.template_id where s.is_delete=0 order by order_list,  list_type"
	con.query(sql,function(err,rows){
	  if(err) throw err;

	  //console.log(rows);
	  data = rows.map(row => { 
		return { id: row.id,idWithGroup:(row.id +'#' + row.parent_id + "#" + row.list_type), name: row.name, storeGroup:(row.list_type + '#' + row.name),templateName: row.template_name, progress: (row.list_type + '#' + row.stage1 + '#' + row.stage2 + '#' + row.stage3 + '#' + row.stage4 + '#' + row.stage5 + '#' + row.stage6 + '#' + row.template_name) }
	  });
	  
	  dbConn.closeConnection(con);
	  return res.json(data); 
	});  
},
updateData: function(req,res)
{ 
	var dataReceived = "";
	req.on('data', function (data) {
		dataReceived += data; 
		console.log(data);
	}); 
	req.on('end', function () { 
		dataReceived = JSON.parse(dataReceived); 
		console.log("dataReceived:" + dataReceived);
		console.log("dataReceived['templateId']:" + dataReceived["templateId"]);
		console.log("dataReceived['selectedCheckbox']:" + dataReceived["selectedCheckbox"]);
		 
			console.log("dataReceived['selectedCheckbox'][i]:" + dataReceived["selectedCheckbox"].length );
		for(var i=0; i<dataReceived["selectedCheckbox"].length ; i++)
		{ 
			console.log("here1");
			var dataSplit = dataReceived["selectedCheckbox"][i].split("#");
			console.log("here2");
			var dataId = dataSplit[0];
			console.log("here3:" + dataId);
			var dataGroupStore = dataSplit[2];
			console.log("dataReceived['selectedCheckbox'][i]:" + dataReceived["selectedCheckbox"][i]);
				
			if(dataGroupStore == "store")
			{				
				console.log("it is a store");
				//console.log("dataReceived['selectedCheckbox'][i]:" + dataReceived["selectedCheckbox"][i]);
				const con = dbConn.openConnection();
				con.query('UPDATE codmgr2.store SET stage1=0,stage2=0,stage3=0,stage4=0,stage5=0,stage6=0,template_id=? WHERE id=?', [dataReceived["templateId"],dataId], function(err, result) {
					 
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
						const con2 = dbConn.openConnection();
						console.log("dataReceived['templateId']:" + dataReceived["templateId"]);
						con2.query("select t.*,s.salt_id as target from codmgr2.template t CROSS JOIN store s WHERE t.id=? AND s.id=?", [dataReceived["templateId"],dataId], function(err, rows) {
						console.log("dataId:" + dataId);	 
						dbConn.closeConnection(con2);
						
						if(err) 
						{
							console.error ("err.message:" + err.message  + "result: " + result) ;
							if(err.message.includes("ER_DUP_ENTRY"))
								res.statusMessage = "Duplicated data is not allowed";
							else
								res.statusMessage = "Server is not responding. Please try again later";
							res.status(500).end();
						} 
						else
						{
						  var tempWelcome = "";
						  var tempThankyou = "";
						  var tempLogo = "";
						  var tempDefault1 = "";
						  var tempDefault2 = "";
							var tempTarget = [];
						  
						  data = rows.map(row => {
						    console.log("row:" + row.target); 
							tempTarget.push(row.target);
							tempWelcome = row.welcome;
							tempThankyou = row.thankyou;
							tempLogo = row.logo;
							tempDefault1 = row.default1;
							tempDefault2 = row.default2;
							
							//rmsAPI.callRMS(rmsObj);							  
						  });
						  rmsObj = generateRMSObject(tempWelcome, tempThankyou, tempLogo, tempDefault1, tempDefault2,"","",tempTarget);
						  rmsHandlerAPI.callRmsHandler(rmsObj);
							
						}
						//return res.json("success"); 
						});
					}
				
				});
			}
			 
			//console.log("dataReceived['selectedCheckbox'][i]:" + dataReceived["selectedCheckbox"][i]);
		}
		return res.json("success");
		/*
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
		});*/
	});
	
}


};