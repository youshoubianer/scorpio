'use strict'

var Crawer = function(){}

module.exports = new Crawer()

Crawer.prototype.getPage = function * () {
  let targetUrl = config.qzoneUrl + '/' + config.qq + '/' + config.mood
  let getPageInfo = yield nightmare
    .goto(targetUrl)
    .wait('.layout-background')
    // .wait(3000)
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