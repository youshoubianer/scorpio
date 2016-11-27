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
  let feadApi = 'https://h5.qzone.qq.com/proxy/domain/taotao.qq.com/cgi-bin/emotion_cgi_msglist_v6?uin=1509923165&ftype=0&sort=0&pos=0&num=20&replynum=100&callback=_preloadCallback&code_version=1&format=jsonp&need_private_comment=1';

  if(config.cookie){
    
    let gtk = util.getGTK(config.cookieJson['skey']);
    feadApi = feadApi + '&g_tk='+ gtk
    console.log('getFeed gtk>>>',gtk,feadApi);

    let data = yield nightmare.goto(feadApi)
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









