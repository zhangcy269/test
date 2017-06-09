var https=require("https");  
var querystring=require("querystring");  
var url="https://ssl.mail.163.com/entry/coremail/fcg/ntesdoor2?"+  
    "df=webmail163&from=web&funcid=loginone&iframe=1&language=-1&net=c&passtype=1&product=mail163&race=-2_60_-2_hz&style=-1&uid=*******@163.com";  
  
var contents=querystring.stringify({  
    savelogin:1,  
    password:"------",  
    url2:"http://mail.163.com/errorpage/err_163.htm",         
    username:"*******"  
});  
  
var options={  
    host:"ssl.mail.163.com",  
    path:"/entry/coremail/fcg/ntesdoor2?df=webmail163&from=web&funcid=loginone&iframe=1&language=-1&net=c&passtype=1&product=mail163&race=-2_60_-2_hz&style=-1&uid=******@163.com",  
    method:"post",  
    headers:{     
        "Content-Type":"application/x-www-form-urlencoded",  
        "Content-Length":contents.length,         
        "Accept":"text/html, application/xhtml+xml, */*",     
        "Accept-Language":"zh-CN",  
        "Cache-Control":"no-cache",  
        "Connection":"Keep-Alive",    
        "Host":"ssl.mail.163.com",  
        "Referer":"http://mail.163.com/",         
        "User-Agent":"Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; BOIE9;ZHCN)"  
    }  
};  
  
var req=https.request(options,function(res){      
    res.setEncoding("utf8");  
    var headers=res.headers;  
    //console.log(headers);  
    var cookies=headers["set-cookie"];  
    cookies.forEach(function(cookie){  
        console.log(cookie);  
    });  
    res.on("data",function(data){  
        console.log(data);  
    });  
});  
  
req.write(contents);  
req.end();  