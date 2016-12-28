'use strict';

let Crawer = function(){}

module.exports = new Crawer();

Crawer.prototype.fetchPostRecommendations = function *() {
  let limit = 20,offset = 10000;
  for(let i = 0; i < offset; i++){
    let targetUrl = `${config.postsUrl}?limit=${limit}&offset=${i * limit}`;
    console.log('fetch>>>',targetUrl);
    let resData = yield this.fetchUrl(targetUrl);
    
    //解析数据
    resData = JSON.parse(resData);

    for(let item of resData){
      let posts = {};
      posts.id = item.id;
      posts.title = item.title;
      posts.url = item.url;
      posts.columnId = item.column_id;
      posts.summary = item.summary;
      let storeStatus = yield this.setToDB(posts);
      console.log(item.id,'',storeStatus);
    }
    
  }
}

//fetch the url and return promise
Crawer.prototype.fetchUrl = function*(url){
  return new Promise(function (resolve, reject) {
    request(url,function(err, res, body){
      if (err) {
        return console.error('upload failed:', err);
      }
      resolve(body);
    })
  })
}

Crawer.prototype.setToDB = function *(data) {
  return yield redisClient.setAsync(data.id,JSON.stringify(data));
}

