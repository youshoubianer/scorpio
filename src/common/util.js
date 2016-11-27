'use strict'

var Util = function(){}

module.exports = new Util()

Util.prototype.getGTK = function(skey){
  var hash = 5381;
  for (var i = 0, len = skey.length;i < len;++i) {
     hash += (hash << 5) + skey.charAt(i).charCodeAt();
   }
  return hash & 2147483647;
}

/*
RK=xmlXZ9EDMQ; hasShowWeiyun1830030443=1
*/
Util.prototype.parseCookie = function(cookie){
  let cookieJson = {}
  let cookieList = cookie.split(';');

  for(let item of cookieList){
    let kv = item.trim().split('=');
    cookieJson[kv[0]] = kv[1]
  }
  config.cookieJson = cookieJson;
  return cookieJson;
}



