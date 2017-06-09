var request = require('superagent');
var fs = require('fs');
var xlsx = require("node-xlsx");
var LocalStorage = require('node-localstorage').LocalStorage;
var cheerio = require('cheerio');
var header = {
  'Host': 'www.adidas.com.cn',
  'Connection': 'keep-alive',
  'Cache-Control': 'max-age=0',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.110 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Encoding': 'gzip, deflate, sdch',
  'Accept-Language': 'zh-CN,zh;q=0.8',
  'Referer': 'http://www.adidas.com.cn/productlist/?sport_gender=40&product_style=214&producttypecn1=1015',
  'Cookie': ''
};

var frontend; // 有用的cookie
var file;     // 商品样式文件

var excelName = "Book1.xlsx";
var goodsTab = {goodsInfo:0, goodsEntry:1};
var goodsInfoHeader = {token:0, release2: 1, qty:2, product: 3, super_attribute: 4, isajax:5, super_attributeIndex:6};
var goodsEntryHeader = {id:0, name: 1, page:2, line: 3};

var url = process.argv[2];
var id = process.argv[2];
var good = xlsx.parse(excelName)[goodsTab.goodsEntry].data[id];
var line = good[goodsEntryHeader.line];                          
var list = xlsx.parse(excelName)[goodsTab.goodsInfo].data[line];

function saveInFile(filename, text) {
  fs.writeFile(filename, text, function (err) {
    if (err) throw err;
    console.log('It\'s saved!'); //文件被保存
  });
}

// header.Referer = header.Referer = header.Referer = good[goodsEntryHeader.page];

// 为了取得cookie
request.get('https://www.adidas.com.cn/api/ajaxheader.php')
  .set(header)
  .end(function(err,res){
    var cookie = res.header['set-cookie'];
    for (var i=0; i<cookie.length; i++) {
      // console.log(cookie[i]);
      var temp = cookie[i].split('=');
      if (temp[0] == 'frontend') {
        frontend = cookie[i];
        break;
      }
    }

  var localStorage = new LocalStorage('./scratch');
  if (!localStorage.getItem('frontend')) localStorage.setItem('frontend', frontend);
  // frontend = 'frontend=5eutmoet3agak6lkc20mp91rh4; path=/'
  header.Cookie = localStorage.getItem('frontend');
  console.log(header.Cookie);
  
  // url = 'http://www.adidas.com.cn/b47765';//http://www.adidas.com.cn/specific/product/ajaxview/?id=340974
  // request.get(url)
  //   .set(header)
  //   .end(function(err, res){
  //     saveInFile("by.html", res.text);
  //     if (err) throw err;
  //     if (res.status === 200) {
  //       console.log(res.text);
  //       var $ = cheerio.load(res.text);
  //     }
  //     console.log('dddd');
  //     $('#product_addtocart_form').each(function (index, item) {
  //       var $item = $(this);
  //       // var token = $item.find('input[type=hidden]');
  //       console.log('wqji',index);
  //     });
  //   });

  // 商品被加到购物车里
  var at = {};
  var attr = list[goodsInfoHeader.super_attributeIndex];
  attr = 'super_attribute[' + attr + ']';
  at[attr] = list[goodsInfoHeader.super_attribute];
  request.post('http://www.adidas.com.cn/checkout/cart/add/')
    .set(header)
    .type('form')
    .send({ token: list[goodsInfoHeader.token] })
    .send({ isajax: list[goodsInfoHeader.isajax]})
    .send({ release2: list[goodsInfoHeader.release2]})
    .send({ qty: list[goodsInfoHeader.qty]})
    .send({ product: list[goodsInfoHeader.product]})
    .send(at)
    .end(function(err, res){

      // 查看购物袋
      var info = {sum:0, discount:0, price:0, total:0, items:[]};
      request.get('http://www.adidas.com.cn/checkout/cart/')
        .set(header)
        .end(function(err, res) {
            if (err) throw err;
            if (res.status === 200) {
                var $ = cheerio.load(res.text);
            }
            $('.col4-1').each(function (index, item) {
                var $item = $(this);
                info.sum = $item.find('.font24 small').text();
                console.log("您的购物袋" + info.sum);

            });
            $('.checkoutProBox').each(function (index, item) {
              var $item = $(this);
              var item;
            });
            saveInFile('cart.html', res.text);
        });

      // 立即结算
      request.get('http://www.adidas.com.cn/yancheckout/process/')
        .set(header)
        .end(function(err, res) {
          saveInFile('checkout.html', res.text);
        });
        
    });



});