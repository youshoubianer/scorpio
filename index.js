'use strict'

require('./bin/load_global')
const QzoneLogin = require('./src/login')
const crawer = require('./src/crawer')


if(process.argv[2] === 'sync'){
  require('./src/common/sync')()
}else{
  co(function*(){
    //登录 获取cookie
    yield QzoneLogin.login()
    console.log('cookie>>>',config.cookie);
    util.parseCookie(config.cookie);
    let moodMsgList = yield crawer.fetchMood();
    
    //first page
    // let pageInfo = yield crawer.getPage()
    // let pageInfo = yield crawer.getFeed()
    // console.log('first pageInfo>>>',pageInfo);
  })
}

