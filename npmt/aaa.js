var app = require("https");
app.post("/sendMsgToAByPost",function(req, res, next) {

//我的帖子：http://cnodejs.org/topic/4ffed8544764b729026b1da3
//http://yefeng.iteye.com/blog/315847
//http://stackoverflow.com/questions/5744990/how-to-upload-a-file-from-node-js
//http://stackoverflow.com/questions/9943010/node-js-post-file-to-server


console.log(req.files);
console.log(req.files.media.size);
var boundaryKey = Math.random().toString(16); //随机数，目的是防止上传文件中出现分隔符导致服务器无法正确识别文件起始位置
console.log(boundaryKey);
    
    var options = {
    		host: 'api.com',
    		port: 443,
    		path: '/media?type=image&access_token='+accessToken,
    		method: 'POST'
    };
    
    var reqHttps = https.request(options, function(resHttps) {
    	console.log("statusCode: ", resHttps.statusCode);
    	console.log("headers: ", resHttps.headers);
    	
    	resHttps.on('data', function(body1) {
		console.log("body:"+body1);
		});
    });
    var payload = '--' + boundaryKey + '\r\n'
    // use your file's mime type here, if known
    + 'Content-Type: image/jpeg\r\n' 
    // "name" is the name of the form field
    // "filename" is the name of the original file
    + 'Content-Disposition: form-data; name="media"; filename="aaa.jpg"\r\n'
    + 'Content-Transfer-Encoding: binary\r\n\r\n';
    console.log(payload.length);
    var enddata  = '\r\n--' + boundaryKey + '--';
    console.log('enddata:'+enddata.length);
    reqHttps.setHeader('Content-Type', 'multipart/form-data; boundary='+boundaryKey+'');
    reqHttps.setHeader('Content-Length', Buffer.byteLength(payload)+Buffer.byteLength(enddata)+req.files.media.size);
    
    reqHttps.write(payload);
    
    var fileStream = fs.createReadStream("D:\\aaa.jpg", { bufferSize: 4 * 1024 });
    fileStream.pipe(reqHttps, {end: false});
    fileStream.on('end', function() {
    	// mark the end of the one and only part
    	reqHttps.end(enddata); 
    	
    });
    
    reqHttps.on('error', function(e) {
    	console.error("error:"+e);
    });
});