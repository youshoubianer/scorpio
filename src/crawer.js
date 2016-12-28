'use strict'

var Crawer = function(){}

module.exports = new Crawer()

Crawer.prototype.fetchMood = function *() {

  if(config.cookie){
    let gtk = util.getGTK(config.cookieJson['p_skey']);
    let targetUrl = 'http://taotao.qq.com/cgi-bin/emotion_cgi_msglist_v6';
    let params = {
      uin: config.qq,
      pos: 0,
      num: 20,
      g_tk: gtk,
    };
    let page = 1
    while(page > 0){
      params.pos = (page - 1) * page.num;
      let currentPageData = yield Crawer.fetchUrl(targetUrl,params);
      console.log('currentPageData>>>',currentPageData);
      
      currentPageData.msgList ? page++ : -1;
    }
    
  }
}


Crawer.prototype.fetchUrl = function *(targetUrl,params){
  console.log('aaa');
  return new Promiss(function (resolve, reject){
    targetUrl += (targetUrl.indexOf('?') === -1 ? '?' : '') + querystring.stringify(params);
    
    console.log(targetUrl);

    //set cookie to request
    let cookieJar = request.jar();
    let cookieArray = config.cookie.split(';')
    for(let key in config.cookieJson){
      let item = `${key}=${config.cookieJson[key]}`
      cookieJar.setCookie(item, targetUrl)
    }
    request({
        method: 'GET',
        uri: targetUrl,
        jar: cookieJar,
        headers: {
          'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36'
        }
    },
    function(err, res, body) {
        if (err) { reject(err) };
        console.log(res.statusCode);
        let callbackName = '_Callback';
        let jsonData = body.slice(callbackName.length+1,body.length-2);
        jsonData = JSON.parse(jsonData);
        resolve(jsonData);
    });
  });
}

