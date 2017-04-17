  
module.exports = 
{

getProgressData: function(req,res)
{ 
  var objListTemp = [];
  var objTemp = {};
  objTemp.id = 1;
  objTemp.name = "progress 1";
  objTemp.storeGroup = "store#progress1";
  objTemp.templateName = "PURCHASED";
  objTemp.progress = "store#1#1#1#0#0#0#PROGRESS1";
  
  objListTemp.push(objTemp);
  return res.json(objListTemp); 
		
}


};