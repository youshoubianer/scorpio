'use strict';

require('./bin/global');

co(function*(){
  
  let crawerData = yield crawer.fetchPostRecommendations();
  console.log('crawer>>>',crawerData);
  return crawerData;
}).then(data => {
  console.log(data);
},function (err) {
  console.log('error>>> ',err);
})