'use strict'

exports.login = function* (){
  let getCookie =  yield nightmare
    .goto(config.url)
    .click('#switcher_plogin')
    .type('#loginform [name=u]','')   //清空
    .type('#loginform [name=u]',config.qq)
    .type('#loginform [name=p]',config.pwd)
    .click('#login_button')
    .wait(config.loginWait)
    .evaluate(function(){
      return document.cookie
    })
    .then(function (cookie) {
      config.cookie = cookie
    })

  return getCookie
}
