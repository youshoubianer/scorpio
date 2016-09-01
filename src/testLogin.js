//qq空间模拟登录

var url = 'http://qzone.qq.com'
var casper = require('casper').create(); 
casper.start(url);

casper.withFrame('login_frame', function() {
  this.open(this.getCurrentUrl())
})

casper.waitForSelector('#switcher_plogin')
casper.thenClick('#switcher_plogin')
casper.waitForSelector('#loginform')
casper.then(function(){
  this.fillSelectors('#loginform', {
       'input[name="u"]': '1830030443',
       'input[name="p"]': 'zxdwy521'
   }, false);
})
casper.waitForSelector('#login_button')
casper.thenClick('#login_button')
casper.wait(1000,function(){
  this.echo(this.getTitle());
})

//get cookie
casper.then(function() {
    var cookies = phantom.cookies;
    this.echo("cookie.length = " + cookies.length);
    for (var i in cookies) {
        this.echo(cookies[i].name + "=" +  cookies[i].value);
    }
});
casper.run();