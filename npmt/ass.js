var https = require('https');
var headers = {
'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
'Accept-Encoding':'gzip, deflate, br',
'Accept-Language':'zh-CN,zh;q=0.8',
'Cache-Control':'max-age=0',
'Connection':'keep-alive',
// 'Content-Length':'358',
'Content-Type':'multipart/form-data; boundary=----WebKitFormBoundaryRctJarAZIwcEpggB',
//'Cookie':'bm_mi=473E06D0F6E1788F0EC684B650C14538~+eqG/Rjamj08d+8FDmOJF1t4lmKPsV3fbG6VXK0Hmd//YEF4lTc4gPbMkixrt+Lj0gbsnmZKahPBJM4DCXp/QIc8EFQHhfhnuFg9XEGC/yHX3kpJ8/B7AqzO75yUcXqstlFU6VAtwYBukukphI4T0yXfuTevEbKyPs1/o5iZDjhye2xrX4f41XG+LHW8e51Lp2sNIuSRJ2oY959pqEDpTkFUJabjfHB8/yfLLvW/wPDsqnFMOIj1T24ItHWoXE3rD06OtagVWlRCNpyhoCJiJQ==; __v3_c_uactiveat_11403=1495785578391; ak_bmsc=F86E618C7E6E4D2C8B667A96729F7E453CDDDC666368000068E02759DB070170~plUGw+KhhR3SFdUX42m+rSUMjAv5TOlOYKRiiD+5cOi4ufY2e9ln+AN7dCFPQjcYuk4T13UdmWq982YtOsGSUqduhKmcOFnB2/Mg1gUefG90ekZkbEVpMD5ZiqHhsawLIIGzpizACtqGnAL0x+19wZ5YXRbzqekJ6m63aJwCsDnrbPwXGX68xubqs8qM7l/xQ+/kJHK+Jb1VGs+CNAgtsrLt3U+bfHYqz1aXYZEzewVE5QuXoXylHi3sQMNHroUE/a; __v3_c_sesslist_11404=eq7mgite23_dcw%252Ceq6dnqcont_dcv; __v3_c_today_11404=1; __v3_c_review_11404=2; __v3_c_last_11404=1495787453841; __v3_c_sesslist_11403=eq7o4ulek9_dcw%252Ceq7nnyxrbc_dcw%252Cdcw%252Cdcv%252Cdcv; AMCVS_7ADA401053CCF9130A490D4C%40AdobeOrg=1; AMCV_7ADA401053CCF9130A490D4C%40AdobeOrg=-227196251%7CMCIDTS%7C17312%7CMCMID%7C50558213517556900758242456996704154369%7CMCAID%7CNONE%7CMCOPTOUT-1495796537s%7CNONE%7CMCAAMLH-1496292886%7C11%7CMCAAMB-1496394137%7Chmk_Lq6TPIBMW925SPhw3Q; Hm_lvt_690ef42ff30759b60f6c189b11f82369=1495688112,1495785717,1495788404,1495789342; Hm_lpvt_690ef42ff30759b60f6c189b11f82369=1495790238; Hm_lvt_c29ad6ea0a27499743676357b8867377=1495688112,1495785717,1495788404,1495789342; Hm_lpvt_c29ad6ea0a27499743676357b8867377=1495790238; loginSendError=0; frontend=i65a7v3789scc2up4ukivu2gt0; _ga=GA1.3.1838141565.1495688080; _gid=GA1.3.2133196764.1495790638; _gat=1; utag_main=v_id:015c3df4ea3500808e34a8968bb00406d001906500bd0$_sn:4$_ss:0$_st:1495792437529$ses_id:1495785578341%3Bexp-session$_pn:46%3Bexp-session; s_cc=true; __v3_c_isactive_11403=1; __v3_c_pv_11403=12; __v3_c_session_11403=1495789336128249; __v3_c_today_11403=3; __v3_c_review_11403=4; __v3_c_last_11403=1495790635958; __v3_c_visitor=1495688160551321; __v3_c_session_at_11403=1495790637631; frontend=i65a7v3789scc2up4ukivu2gt0; bm_sv=21F1AFC168D19B00F162D1B9149C3572~LqZ9z4WiiISDxgWjMc743qHUmD4H3O6XxiSojKdmnyqP0d9r81bxgxSb/xlYRkd8vpSIAKLJIiopZG3zPsjnl6pZpgEEFb8G0yUDKDsofWdiZciHX4gLkd60cHFAinY+qtcuDu9Q2bd9yTjQN1n7bFBKKWQmPmcHe8EuSVF0qKU=; s_pers=%20s_vnum%3D1496246400450%2526vn%253D4%7C1496246400450%3B%20v56%3D%255B%255B%2527EXTERNAL%252520CHANNEL%2527%252C%25271495789337924%2527%255D%255D%7C1653555737924%3B%20pn%3D9%7C1498381337925%3B%20c4%3DACCOUNT%257CLOGIN%7C1495792438733%3B%20s_invisit%3Dtrue%7C1495792438734%3B; s_sq=ag-adi-cn-prod%3D%2526pid%253DACCOUNT%25257CLOGIN%2526pidt%253D1%2526oid%253D%2525E7%252599%2525BB%252520%2525E5%2525BD%252595%2526oidt%253D3%2526ot%253DSUBMIT',
'Host':'www.adidas.com.cn',
'Origin':'https://www.adidas.com.cn',
'Referer':'https://www.adidas.com.cn/customer/account/login/',
'Upgrade-Insecure-Requests':'1',
'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.110 Safari/537.36',
// 'Content-Diposition':asd

};
    var options = {
    		host: 'www.adidas.com.cn',
    		port: 443,
    		path: '/customer/account/login',
    		method: 'post',
    		headers:headers
    };
var reqHttps = https.request(options, function(resHttps) {
	console.log(resHttps);
});