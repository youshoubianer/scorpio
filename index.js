'use strict'

require('./bin/load_global')
const QzoneLogin = require('./src/login')
const crawer = require('./src/crawer')

co(function*(){
  //登录 获取cookie
  yield QzoneLogin.login()
  console.log('cookie>>>',config.cookie);
  
  //first page
  let pageInfo = yield crawer.getPage()
  console.log('first pageInfo>>>',pageInfo);
})
