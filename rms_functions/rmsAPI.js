module.exports = 
{

callRMS: function(data)
{ 

var server = '192.168.3.125:9090';

var W3CWebSocket = require('websocket').w3cwebsocket;
 
var client = new W3CWebSocket('ws://' + server + '/ws', 'echo-protocol');
 
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

};