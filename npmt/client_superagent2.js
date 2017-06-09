var request = require('superagent');
var fs = require('fs');
var eheaders = {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    Origin: 'https://www.adidas.com.cn',
    // 'X-FirePHP-Version': '0.0.6',
    'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.110 Safari/537.36',
    'Content-Type':'multipart/form-data; boundary=----WebKitFormBoundaryRctJarAZIwcEpggB',
    // DNT: 1,
    Referer: 'https://www.adidas.com.cn/customer/account/login/',
    'Accept-Encoding':'gzip, deflate, br',
    'Accept-Language':'zh-CN,zh;q=0.8',
    'Cache-Control':'max-age=0',
    'Connection':'keep-alive',
    // 'Content-Length':'358',
};
var asd = '"'+'\r\n'+'zhangcy269'+'\r\n'+'------WebKitFormBoundaryKD3XhXccEHvSWUJo'
var headers = {
'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
'Accept-Encoding':'gzip, deflate, br',
'Accept-Language':'zh-CN,zh;q=0.8',
'Cache-Control':'max-age=0',
'Connection':'keep-alive',
// 'Content-Length':'358',
// 'Content-Type':'multipart/form-data; boundary=----WebKitFormBoundaryRctJarAZIwcEpggB',
// 'Cookie':'__v3_c_uactiveat_11403=1495878490769; bm_mi=C051F07B55A95078413FCB9636AC4137~BlJ86AaYRFZHtGnHOssV7vbvyHbLykzWdnCsU0yubZzJ5C8yKc3gIZRKD0H47Yz7Qkj50lQ01wCz/YrT2Zg4gLYVY2BwIb3rVr17/Hu5vzZD3Jj0OvNy3iqFP5/cJnk8CSdMqPSvKjm6L+4fhB16W4Rz2TFrYMx2TrhY+6kbrtRfe55QDkV3myFnn1PkAA5luucAEnoqvDw8mHRhra0M+4lYF/IQvzTuIUu7wPZHvLkhSUcyBVD23JNkRJP848J0lIIXfPiOrGvTK3pmmhmyZA==; ak_bmsc=B4DB92E4D99DFA2EC6372DF9BD28119D3CDDDC75F715000078872E59D22DD42B~plqBLHPJkgHxOrtF/OhEuhuCOxCQ/UENP9oHB3BHafwlzEnk/DhzafTR/1IWJHtR8CtzU+PICHpP1H8U+CXnVyNtQb27MU5wVhJvS0Mlt8PHiPRRLgAeHZp5YtSMotvYnEK1IKTCRGg1rwBWXDPa+ykvOEHWzQvDwCiE5l3ZaVPIk23g57VXisObbgwgqXLBYA6z8KKuS1gdcosoJp+l6YIfJNRxAQFA8+6ZgEYylolpC5oh05jNZrf3+1qgJsgGi9; __v3_c_sesslist_11403=eqd90ukyx8_dd1%252Ceqd6p1p6tc_dd1%252Cdd1%252Cdcx%252Cdcx%252Cdcw; AMCVS_7ADA401053CCF9130A490D4C%40AdobeOrg=1; AMCV_7ADA401053CCF9130A490D4C%40AdobeOrg=-227196251%7CMCIDTS%7C17318%7CMCMID%7C16095206280602209560855816385164161404%7CMCAAMLH-1496398032%7C11%7CMCAAMB-1496831944%7CcIBAx_aQzFEHcPoEv0GwcQ%7CMCOPTOUT-1496234344s%7CNONE%7CMCAID%7CNONE; Hm_lvt_690ef42ff30759b60f6c189b11f82369=1495793438,1495854129,1496227320; Hm_lpvt_690ef42ff30759b60f6c189b11f82369=1496227320; Hm_lvt_c29ad6ea0a27499743676357b8867377=1495793438,1495854129,1496227320; Hm_lpvt_c29ad6ea0a27499743676357b8867377=1496227320; customer_id=1361280; loginSendError=0; utag_main=v_id:015c4439692d000c0a1d6f8272610406d003106500bd0$_sn:10$_ss:0$_st:1496229130044$ses_id:1496226627404%3Bexp-session$_pn:10%3Bexp-session; _ga=GA1.3.1478110998.1495793232; _gid=GA1.3.1325620674.1496206135; __v3_c_isactive_11403=1; __v3_c_pv_11403=10; __v3_c_session_11403=1496226627492812; __v3_c_today_11403=3; __v3_c_review_11403=5; __v3_c_last_11403=1496227330130; __v3_c_visitor=1495793230466963; s_pers=%20v56%3D%255B%255B%2527EXTERNAL%252520CHANNEL%2527%252C%25271496206144154%2527%255D%255D%7C1653972544154%3B%20pn%3D4%7C1498798144155%3B%20s_vnum%3D1496246400948%2526vn%253D10%7C1496246400948%3B%20c4%3DHOME%7C1496229130109%3B%20s_invisit%3Dtrue%7C1496229130113%3B; s_sq=%5B%5BB%5D%5D; s_cc=true; frontend=73v3d373uhmgdn3hku5rtl8071; bm_sv=389E3136300465CC648535F4BF9048D0~xqHk2dHYA1bplYdshYPZudAsWNiV7h4CjlXQ2PqW+g978Ur72y5boKB+WvOtDIZVk4XFL1hHyy4VDZPlmi1uFijzm2Z7WR+E0+GU3YUHvBHFYBmlbCRE869W8gFPswuAegqm0DDR1ke8vVEYQydTg4FNKwMXD8AdrsBtHx+WOeU=; __v3_c_session_at_11403=1496227510119',
'Host':'www.adidas.com.cn',
// 'Origin':'https://www.adidas.com.cn',
// 'Referer':'https://www.adidas.com.cn/customer/account/login/',
'Upgrade-Insecure-Requests':'1',
'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.110 Safari/537.36',
// 'Content-Diposition':asd

};

var req = request.get('http://www.adidas.com.cn/api/ajaxheader.php')
 //req.part()
 .set(headers)
 
 // req.part()
 // .set('Content-Disposition','form-data; name="login[username]')
 // .write('zhangcy269');
 
 // req.part()
 // .set('Content-Disposition','form-data; name="login[password]')
 // .write('227031zcy');

 // req.part()
 // .set('Content-Disposition','form-data; name="send')
 // .write('');
            //   .set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
            //   .set('Accept-Encoding','gzip, deflate, br')
            //   .set('Accept-Language','zh-CN,zh;q=0.8')
            //   .set('Cache-Control','max-age=0')
            //   .set('Connection','keep-alive')
            //   .set('Content-Type','multipart/form-data; boundary=----WebKitFormBoundaryRctJarAZIwcEpggB')
            //   .set('Host','www.adidas.com.cn')
            //   .set('Origin','https://www.adidas.com.cn')
            //   .set('Referer','https://www.adidas.com.cn/customer/account/login/')
            //   .set('Upgrade-Insecure-Requests','1')
            //   .set('User-Agent','Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.110 Safari/537.36')
            // // .type('form')
            // .field('login[username]', 'zhangcy269')
            // .field('login[password]', '227031zcy')
            // .field('send','')

  // .send('username=zhangcy269')
    // .send('password=227031zcy')
 .end(function(err, res){
  console.log(res.text);
  // request.get('https://www.adidas.com.cn/customer/account/')
  // .set(headers)
  // .end(function(err,res){
    
  //   fs.writeFile('ssddd.html', res.text, function (err) {

  //       console.log('It\'s saved!'); 
  //   });
  // });
// fs.writeFile('bb.html', res.text, function (err) {
//     if (err) throw err;
//     console.log('It\'s saved!'); //文件被保存
//     // https://www.adidas.com.cn/api/ajaxheader.php
//     request.get('https://www.adidas.com.cn/api/ajaxheader.php')
//     .set(eheaders)
//     .end(function(err,res){console.log(res.text);});
// });
 });