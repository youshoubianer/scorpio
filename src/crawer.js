'use strict'

var Crawer = function(){}

module.exports = new Crawer()

Crawer.prototype.getPage = function * () {
  let targetUrl = config.qzoneUrl + '/' + config.qq + '/' + config.mood
  console.log('targetUrl>>>',targetUrl);
  let getPageInfo = yield nightmare
    .goto(targetUrl)
    // .wait('.layout-background')
    .wait(10000)
    .evaluate(function(){
      console.log('begin>>>');
      var frame = window.frames[0].document
      var feeds = frame.querySelectorAll('.feed'),
          feed = ''
      console.log('feeds>>> ',feeds);
      for(feed of feeds){
        console.log('feed>>>',feed);
        console.log('text>>> ',feed.querySelector('.bd .content').innerHTML);
        console.log('attr>>> ',feed.querySelector('.md a img').src);
        console.log('time>>> ',feed.querySelector('.ft .info a').innerHTML);
        console.log('device>>> ',feed.querySelector('.ft .info .custom-tail').innerHTML);
        // console.log('likes>>> ',feed.querySelectorAll('.qz_like_btn')[1].innerHTML);
        console.log('评论>>> ',feed.querySelector('.comment_btn').innerHTML);
        console.log('转发>>> ',feed.querySelector('.forward_btn').innerHTML);
        // console.log('liker>>> ',feed.querySelector('.feed_like a').href,feed.querySelector('.feed_like a').innerHTML);
      }
      
      return 'title'
    })
    .then(function (result) {
      return result
    })
    
  return getPageInfo
}

Crawer.prototype.getFeed = function*(){
  let feadApi = `http://taotao.qq.com/cgi-bin/emotion_cgi_msglist_v6?uin=${config.qq}&pos=0&num=20`;

  if(config.cookie){
    
    let gtk = util.getGTK(config.cookieJson['skey']);
    feadApi = `${feadApi}&g_tk=${gtk}`;
    console.log('getFeed gtk>>>',gtk,feadApi);

    nightmare.goto(feadApi).then(function(req,res){
      console.log('req>>>',req);
      console.log('res>>>',res);
    })
    console.log('data>>>',data.slice(0,100));

  }
  else{
    console.log('找不到cookie！');
    return false;
  }  
}

function _preloadCallback(obj) {
  console.log('obj>>>',typeof(obj));
}

Crawer.prototype.fetchMood = function *() {
  let feadApi = `http://taotao.qq.com/cgi-bin/emotion_cgi_msglist_v6?uin=${config.qq}&pos=0&num=20`;

  if(config.cookie){
    let gtk = util.getGTK(config.cookieJson['p_skey']);
    feadApi = `${feadApi}&g_tk=${gtk}`;
    
    let cookieJar = request.jar();
    let cookieArray = config.cookie.split(';')
    for(let key in config.cookieJson){
      let item = `${key}=${config.cookieJson[key]}`
      cookieJar.setCookie(item, feadApi)
    }
    
    request({
        method: 'GET',
        uri: feadApi,
        jar: cookieJar,
        headers: {
          'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36'
        }
    },
    function(err, res, body) {
        if (err) { return console.log(err) };
        console.log(res.statusCode);
        console.log(body);
    });
  }
}









