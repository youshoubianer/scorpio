'use strict'

var Crawer = function(){}

module.exports = new Crawer()

Crawer.prototype.getPage = function * () {
  let getPageInfo = yield nightmare
    .goto(config.firstPageUrl)
    .wait('.head-info h1 span')
    .evaluate(function(){
      var title = document.querySelector('.head-info h1 span').innerHTML
      console.log('title>>>',title);
      return title
    })
    .then(function (result) {
      return result
    })
    
  return getPageInfo
}