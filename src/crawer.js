'use strict'

let Crawer = function(){}

module.exports = new Crawer()

Crawer.prototype.fetchMood = function *(qq) {
  let targetUrl = config.moodApi;
  let params = {
    uin: qq,
    pos: 0,
    num: 20,
    g_tk: config.gtk,
  };
  let page = 1;
  
  let currentPageData = {};
  while(page > 0){
    console.log('page>>>',page);
    params.pos = (page - 1) * params.num;
    currentPageData = yield this.fetchUrl(targetUrl,params);
    
    //异常返回
    if(currentPageData.code != 0){
      return currentPageData;
    }
    
    if(currentPageData.msglist && currentPageData.msglist.length > 0){
      page++;
      yield this.saveMoodsData(currentPageData);
    }
    else{
      page = -1;
    }
    
  }
  
  return currentPageData;
}

//fetch the url
Crawer.prototype.fetchUrl = function *(targetUrl,params){
  targetUrl += (targetUrl.indexOf('?') === -1 ? '?' : '') + querystring.stringify(params);
  
  console.log(targetUrl);

  //set cookie to request
  let cookieJar = request.jar();
  let cookieArray = config.cookie.split(';')
  for(let key in config.cookieJson){
    let item = `${key}=${config.cookieJson[key]}`
    cookieJar.setCookie(item, targetUrl)
  }
  return new Promise(function (resolve, reject){
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

//storage the data
Crawer.prototype.saveMoodsData = function *(data){
  let currentUser = data['usrinfo'];
  let currentMoodData = data['msglist'];

  //update qqInfo and status
  yield this.setScoQQ({
    'qq': currentUser['uin'], 
    'name': currentUser.name, 
    'status' : 1
  });
  
  //storage data
  for(let item of currentMoodData){
    let msg = {
      tid : item['tid'],
      content: item['content'],
      publishTime: item['created_time'],
      qq: item['uin'],
      source: item['rt_tid'] || '',
      device: item['source_name'],
      coOridinates: JSON.stringify(item['lbs']),
      isTransfered: Number(Boolean(item['rt_tid'])),
      commentSum: item['cmtnum'],
      transferSum: item['rt_sum'],
    }
    yield this.setScoMood(msg);
    
    //comments
    let currentCommont = item['commentlist'] || [];
    let comments = [];
    let users = [];
    for(let commentIdx = 0,commentLen = currentCommont.length; commentIdx < commentLen; commentIdx ++){
      let commentItem = currentCommont[commentIdx];
      let comment = {
        tid: item['tid'],
        qq: commentItem['uin'],
        name: commentItem['name'],
        content: commentItem['content'],
        pid: 0,
        idx: commentItem['tid'],
        publishTime: commentItem['create_time'],
        device: commentItem['source_name'],
      }
      users.push({'qq':commentItem['uin'], 'name': commentItem['name']});
      
      //评论回复
      let replyComment = commentItem['list_3'] || [];
      let reply = [];
      if(replyComment.length > 0){
        replyComment.map(replyItem => {
          let replyContent = replyItem['content'];
          let replyToInfo = replyContent
                        .slice(2,replyContent.indexOf('}'))
                        .split(',')
                        .map(i=>{return i.split(":")[1]});
          let replyData = {
            tid: item['tid'],
            qq: replyItem['uin'],
            name: replyItem['name'],
            content: replyItem['content'].slice(replyContent.indexOf('}')+1),
            replyTo: replyToInfo[0],
            idx: replyItem['tid'],
            publishTime: replyItem['create_time'],
            device: replyItem['source_name'],
          }
          reply.push(replyData);
          users.push({'qq':replyItem['uin'], 'name': replyItem['name']});
        })
      }
      comment['reply'] = reply;
      comments.push(comment);
    }
    
    if(users.length > 0){
      yield this.setScoQQ(users);
    }
    
    yield this.setScoComment(comments);
  }

}

// set qq info
Crawer.prototype.setScoQQ = function *(qqInfo){
  if(!_.isArray(qqInfo)){
    qqInfo = [qqInfo];
  }
  for(let item of qqInfo){
    if(item.status === 1){
      yield models.scoQqInfo.update({status : 1},{
        where:{qq: item.qq}
      })
    }
    else{
      let userExits = yield models.scoQqInfo.find({where: {qq:item.qq}});
      if(!userExits){
        yield models.scoQqInfo.create({
          qq : item.qq,
          name : item.name, 
          status : item.status || 0
        })
      }
    }
  }
}

// set mood
Crawer.prototype.setScoMood = function *(msg){
  msg = _.toSnake(msg);
  let moodExits = yield models.scoMood.find({where: {tid:msg.tid}});
  if(!moodExits){
    yield models.scoMood.create(msg);
  }
}

// set comment
Crawer.prototype.setScoComment = function *(comment){
  for(let commentItem of comment){
    let reply = commentItem.reply ? commentItem.reply : [];
    delete commentItem.reply;
    commentItem = _.toSnake(commentItem)
    let create = yield models.scoComment.create(commentItem);
    
    for(let replyIdx = 0, replyLen = reply.length; replyIdx < replyLen; replyIdx++){
      let replyItem = reply[replyIdx];
      replyItem['pid'] = create.id;
      replyItem = _.toSnake(replyItem)
      yield models.scoComment.create(replyItem);
    }
  }
}
