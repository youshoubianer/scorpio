'use strict'

const QzoneLogin = require('./login');
const crawer = require('./crawer');

const login = function *(){
  //登录 获取cookie
  console.log('正在登录...');
  yield QzoneLogin.login();
  util.parseCookie(config.cookie);
  
  if(config.cookie && config.cookieJson){
    config.gtk = util.getGTK(config.cookieJson['p_skey']);
  }
  else{
    console.log('get cookie failed!');
  }
  console.log('cookie>>>',config.cookie,config.gtk);
}

const getNext = function *(){
  return yield models.scoQqInfo.find({
    where: {status:0}
  })
}

const work = function *(){
  let hasDone = yield models.scoQqInfo.find({where:{qq: config.qq}});
  if(!hasDone){
    let fetchStatus = yield crawer.fetchMood(config.qq);
    console.log('fetchStatus>>>',fetchStatus);
    if(fetchStatus.code == 0){
      yield crawer.setScoQQ({
        'qq': config.qq, 
        'status' : 1
      });
      console.log('种子qq爬取完毕，一切正常～ :)');
    }
    else{
      console.log('种子qq爬取出错！！ :(');
      process.exit(-1);
    }
  }
  
  let nextQQ = yield getNext();
  let successCount = 0;
  while(nextQQ && successCount < config.maxSuccessCount){
    console.log('\n===================================================');
    console.log(`正在爬取 ${nextQQ.name} 的空间，qq:${nextQQ.qq}`);
    
    let fetchStatus = yield crawer.fetchMood(nextQQ.qq);
    
    if(fetchStatus.code == 0){
      console.log(`完成对${nextQQ.name}的空间的访问～～`);
      yield crawer.setScoQQ({
        'qq': nextQQ.qq, 
        'status' : 1
      });
      nextQQ = yield getNext();
      successCount++;
      continue;
    }
    else if(fetchStatus.code == -3000){
      console.log(`访问${nextQQ.name}的空间失败: ${fetchStatus.message}`);
      
      console.log(`正在重新登录...`);
      yield login();
      continue;
    }
    else {
      console.log(`访问${nextQQ.name}的空间失败: ${fetchStatus.message}，错误码：${fetchStatus.code}`);
      
      //set the forbidden qq status
      yield crawer.setScoQQ({
        'qq': nextQQ.qq, 
        'name': nextQQ.name, 
        'status' : 1
      });
      
      nextQQ = yield getNext();
      continue;
    }
    
  }
}

exports.begin = function * (){
  yield login();
  while(!(config.cookie && config.gtk)){
    console.log('登录失败，重新登录...');
    yield login();
  }
  
  yield work();
  process.exit(0);
  
}
