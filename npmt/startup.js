var request = require('superagent');
var fs = require('fs');
var xlsx = require("node-xlsx");
var LocalStorage = require('node-localstorage').LocalStorage;
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

var frontend;
var localStorage = new LocalStorage('./scratch');

var header = {
	'Host': 'www.adidas.com.cn',
	'Connection': 'keep-alive',
	// 'Cache-Control': 'max-age=0',
	'Upgrade-Insecure-Requests': '1',
	'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.110 Safari/537.36',
	'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
	'Accept-Encoding': 'gzip, deflate, sdch',
	'Accept-Language': 'zh-CN,zh;q=0.8',
	'Cookie': ''
};
var header_pay = {
	'Host': 'unitradeadapter.alipay.com',
	'Connection': 'keep-alive',
	'Upgrade-Insecure-Requests': '1',
	'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.110 Safari/537.36',
	'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
	'Accept-Encoding': 'gzip, deflate, sdch, br',
	'Accept-Language': 'zh-CN,zh;q=0.8'
};

// 保存每次请求的网页
var saveWebPage = process.argv[3] ? true : false;

// 用户输入单一商品的网址
var url_commodity_html = process.argv[2];
var url_ajaxheader_php = 'https://www.adidas.com.cn/api/ajaxheader.php';
var url_ajaxview = 'http://www.adidas.com.cn/specific/product/ajaxview/?id=';
var url_cartAdd = 'http://www.adidas.com.cn/checkout/cart/add/';
var url_checkoutCart = 'http://www.adidas.com.cn/checkout/cart/';
var url_yancheckoutProcess = 'http://www.adidas.com.cn/yancheckout/process/';
var url_saveShippingAndPayment = 'https://www.adidas.com.cn/yancheckout/process/saveShippingAndPayment/';
var url_ajaxcity = 'https://www.adidas.com.cn/specific/ajaxcustomer/ajaxcity';
var url_ajaxdistrict = 'https://www.adidas.com.cn/specific/ajaxcustomer/ajaxdistrict';

var excelName = "Config.xlsx";
var commodityId;
var commodityName;
var commoditySize;
var commodityInfo = {};

var addressInfo = {};

function readConfigForCommodity(url) {
	var good = xlsx.parse(excelName)[0].data;
	for (var i=0; i<good.length; i++) {
		if (good[i][1] == url) {
			// 读表获得用户设置的商品大小和数量
			commodityId = good[i][0];
			commodityName = good[i][2];
			commoditySize = good[i][3];
			commodityInfo['qty'] = good[i][4];
			console.log("您要买的商品是：" + good[i][2] + ",大小为：" + commoditySize + ",数量有：" + commodityInfo['qty'] + "个,ID=" + commodityId);
			return;
		}
	}
}

function readConfigForAddress() {
	var address = xlsx.parse(excelName)[1].data[1];
	addressInfo['shipping[firstname]'] = address[0];
	addressInfo['shipping[email]'] = address[1];
	addressInfo['shipping[country_id]'] = 'CN';
	//addressInfo['shipping[region_id]'] = 485
	addressInfo['shipping[region]'] = address[2]; 
	// addressInfo['shipping[city_id]'] = 2;
	// addressInfo['shipping[district_id]'] = 2;
	addressInfo['shipping[city]'] = address[3];
	addressInfo['shipping[district]'] = address[4];
	addressInfo['shipping[street][]'] = address[5];
	addressInfo['shipping[postcode]'] = address[6];
	addressInfo['shipping[mobile]'] = address[7];
	addressInfo['shipping[tel_areacode]'] = address[8];
	addressInfo['shipping[telephone]'] = address[9];
	addressInfo['shipping[save_in_address_book]'] = '1';
	addressInfo['shipping[use_for_shipping]'] = '1';
	addressInfo['shipping[update_region]'] = '0';
	addressInfo['shipping[primary_shipping]'] = '1';
	addressInfo['shipping[primary_billing]'] = '1';
	addressInfo['shipping[delivery_memo]'] = address[10];
	addressInfo['delivery_type'] = address[11] == '普通快递' ? 'Normal' : '';
	// addressInfo['token'] = a3275cb8acbcea3ceeff4769439857ee
	addressInfo['payment[alipay_pay_bank]'] = address[12]; // 后面要改
	addressInfo['payment[alipay_pay_method]'] = 'bankPay';
	addressInfo['shipping_method'] = 'carrier_bestway';
	addressInfo['fapiao[fapiao_required]'] = (address[13] == null) ? 'off' : 'on';
	addressInfo['fapiao[fapiao_type]'] = (address[13] == '增值税发票') ? 'company' : 'personal';
	addressInfo['fapiao[fapiao_title]'] = address[14];
	addressInfo['fapiao[fapiao_memo]'] = address[15];

}

function saveInFile(filename, text) {
	if (!saveWebPage) return;
	else { 
		fs.writeFile(filename, text, function (err) {
			if (err) throw err;
	    	console.log(filename +' 已经保存'); //文件被保存
	    });
	}
}
function getRequest(head, url, fun) {
	//console.log("Get请求 URL:" + url);
	return request.get(url)
	.set(head)
	.end(fun)
}
function postRequest(head, url, fun, querystring) {
	//console.log("Post请求 URL:" + url);
	return request.post(url)
	.set(head)
	.type('form')
	.send(querystring)
	.end(fun)
}

// 购物车信息
function checkoutCart(err, res) {
	if (err) throw err;
	if (res.status === 200) {
		saveInFile('checkoutCart.html', res.text);
		var $ = cheerio.load(res.text);
		$('.col4-1').each(function (index, item) {
			var $item = $(this);
			var sum = $item.find('.font24 small').text();
			console.log("您的购物袋" + sum);
		});
		$('.checkoutProBox').each(function(index, item) {
			var $item = $(this);
			console.log('\n商品' + (index + 1) + "信息如下：");
			console.log('图片链接是：' + $item.find('.checkoutProImg>a>img').attr('src'));
			console.log('商品详情如下：' + $item.find('.checkoutproTit').text());
			$item.find('.checkoutPorTxt>p').each(function(index, item) {
				var $item = $(this);
				if (index == 0) console.log($item.text() + '\n' + '商品详情如下：');
				else console.log($item.text().replace(/\s/g, ""));
			});
		});
		$('.contentBox>.item>span').each(function (index, item) {
			var $item = $(this);
			if (index == 0) console.log("商品总额：" + $item.text());
			else if (index == 1) console.log("优惠总额：" + $item.text());
			else console.log("商品总计：" + $item.text());
		});
		console.log("\n----------------支付确认------------------\n");
		getRequest(header, url_yancheckoutProcess, yancheckoutProcess);
	}
}

// 给服务器发送配送信息,服务器随后生成支付链接
// 形如：https://www.adidas.com.cn/yancheckout/process/overview/reserved_order_id/4319640805/
function saveShippingAndPayment(err, res) {
	if (err) throw err;
	if (res.status === 200) {
		saveInFile("saveShippingAndPayment.html", res.text);
		var $ = cheerio.load(res.text);
		var payURL = $('.w160').attr('href');
		// console.log('\n支付详情如下：');
		// console.log($('.orderSummary').text().replace(/\s/g,''));
		
		console.log('\n支付链接如下，请通过支付宝或者银行帐号密码，手动打开付款:\n' + payURL);
		// getRequest(header_pay, payURL, function(err, res) {
		// 	if (err) throw err;
		// 	if (res.status === 200) {
		// 		saveInFile("payURL.html", res.text);
		// 	}
		// });
	}
}

// 获取城市
function getCity(err, res) {
	if (err) throw err;
	if (res.status === 200) {
		var cities = unescape(res.text.replace(/\\/g,'%'));
		cities = JSON.parse(cities);
		for(var s in cities){
			if (cities[s] == addressInfo['shipping[city]']){
				addressInfo['shipping[city_id]'] = s;
				var cityInfo = {city_id: addressInfo['shipping[city_id]']};
				postRequest(header, url_ajaxdistrict, getDistrict, cityInfo);
			}
		}
	}
}

// 获取区
function getDistrict(err, res){
	if (err) throw err;
	if (res.status === 200) {
		var districts = unescape(res.text.replace(/\\/g,'%'));
		districts = JSON.parse(districts);
		for (var s in districts) {
			if (districts[s] == addressInfo['shipping[district]']) {
				addressInfo['shipping[district_id]'] = s;
			}
		}
		console.log("\n------------------配送详情----------------\n");
		console.log(addressInfo);
		postRequest(header, url_saveShippingAndPayment, saveShippingAndPayment, addressInfo);
	}
}

// 配送地址获得
function yancheckoutProcess(err, res) {
	if (err) throw err;
	if (res.status === 200) {
		saveInFile('checkoutCart.html', res.text);
		var $ = cheerio.load(res.text);
		console.log("您的购物袋" + $('.orderSummary>h3').text().replace(/\s/g, ""));
		$('.proList>ul>li').each(function(index, item) {
			var $item = $(this);
			console.log('\n商品' + (index + 1) + "信息如下：");
			console.log('图片链接是：' + $item.find('.img>img').attr('src'));
			console.log('商品全称是：' + $item.find('.text').text());
		});
		$('.contentBox>.item>span').each(function (index, item) {
			var $item = $(this);
			if (index == 0) console.log("商品总额：" + $item.text());
			else if (index == 1) console.log("优惠总额：" + $item.text());
			else console.log("商品总计：" + $item.text());
		});
		// 银行代码
		$('input[name="payment[alipay_pay_bank]"]').each(function(index, item){
			var $item = $(this);
			if ($item.attr('title') == addressInfo['payment[alipay_pay_bank]']) {
				addressInfo['payment[alipay_pay_bank]'] = $item.attr('value');
			}
		});
		addressInfo['token'] = $('input[name="token"]').attr('value');
		// 地区城市区域代码
		$('#shipping_region_id>option').each(function(index, item) {
			var $item = $(this);
			if ($item.text() == addressInfo['shipping[region]']) {
				addressInfo['shipping[region_id]'] = $item.attr('value');
				var regionInfo = {region_id: addressInfo['shipping[region_id]']};
				postRequest(header, url_ajaxcity, getCity, regionInfo);
			}
		});
	}
}

// 把商品加入购物车
function addCart(err, res) {
	if (err) throw err;
	if (res.status === 200) {
		saveInFile('addCart.html', res.text);
		console.log("已经加入购物车")
		getRequest(header, url_checkoutCart, checkoutCart);
		// getRequest(header, url_yancheckoutProcess, yancheckoutProcess);
	}
}

// 用编号请求商品具体信息
function getCommodityInfo(err, res) {
	if (err) throw err;
	if (res.status === 200) {
		saveInFile('getCommodityInfo.html', res.text);
		var $ = cheerio.load(res.text);
		var flag = 0;
		var flag2 = 0;
		var sizelist = [];
		if (res.text.indexOf('已售罄') >= 0) {
			console.log("已售罄");
			return;
		}
		if (commodityInfo['qty'] <= 0) {
			console.log("您购买数量过少");
			return;
		}
		$('#product_addtocart_form>input').each(function (index, item) {
			var $item = $(this);
			commodityInfo[$item.attr('name')] = $item.attr('value');
        });

        // 尺码表
		$('#size_box>option').each(function(index, item) {
			var $item = $(this);
			sizelist.push($item.text());
			if ($item.text() == commoditySize) {
				flag2 = 1;
				commodityInfo[$('.copySelectSize>input').attr('name')] = $item.attr('value');
			}
		});
		if (flag2 == 0) {
			console.log("服装没有" + commoditySize + '号尺码，现存尺码有 ' + sizelist);
			return;
		}

		// 购买数量
		var sim_stock = "#sim_stock_" + commodityInfo[$('.copySelectSize>input').attr('name')];
		if (commodityInfo['qty'] > $(sim_stock).attr('value')) {
			console.log('您打算购买' + commodityInfo['qty'] + '件,库存只有' + $(sim_stock).attr('value') + '件，');
			return;
		}
		// console.log(commodityInfo);
		if (Object.keys(commodityInfo).length == 6) console.log("获取商品信息成功");
		postRequest(header, url_cartAdd, addCart, commodityInfo);
	}
}

// 获得商品编号
function getCommodityId(err, res) {
	if (err) {
		console.log('商品网址写错');
		return;
	}
	if (res.status === 200) {
		saveInFile("getCommodityId.html", res.text);
		var str = res.text.match(/id=(\S*)&psort=/)[1];
		console.log('\n--------------------商品详情---------------------\n');
		console.log("商品编号是：" + str);
		url_ajaxview = url_ajaxview + str;
		return getRequest(header, url_ajaxview, getCommodityInfo);
	}
}

// 只读取头信息得到游客身份cookie
function getCookie(err, res){
	var cookie = res.header['set-cookie'];
	for (var i=0; i<cookie.length; i++) {
		if (cookie[i].indexOf('frontend') >= 0) {
			frontend = cookie[i];
			break;
		}
	}
	if (!frontend) {
		return;
	}
	else {
		// if (!localStorage.getItem('frontend')) 
		// 	localStorage.setItem('frontend', frontend);
		// header.Cookie = localStorage.getItem('frontend');
		header.Cookie = frontend;
		console.log("游客访问身份标识为:" + header.Cookie);
		return getRequest(header, url_commodity_html, getCommodityId);
	}
}
function main(){
	// localStorage.clear();
	console.log('\n--------------用户详情----------------\n');
	readConfigForCommodity(url_commodity_html);
	readConfigForAddress();
	var ret = getRequest(header, url_ajaxheader_php, getCookie);
}
main();
