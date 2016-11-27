'use strict'

require('./bin/load_global')
const QzoneLogin = require('./src/login')
const crawer = require('./src/crawer')

co(function*(){
  //登录 获取cookie
  yield QzoneLogin.login()
  console.log('cookie>>>',config.cookie);
  util.parseCookie(config.cookie);
  
  
  //first page
  // let pageInfo = yield crawer.getPage()
  let pageInfo = yield crawer.getFeed()
  // console.log('first pageInfo>>>',pageInfo);
})
