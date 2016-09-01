var express = require('express');
var config = require('./config/setting')

var app = express();
app.set('port',config.port || 8080);

//set public
app.use(express.static(__dirname + '/public'))

//404
app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - not found');
});

//500
app.use(function(req,res){
  res.type('text/plain');
  res.status(500);
  res.send('500 - server error');
});

app.listen(app.get('port'),function(){
  console.log('Express started at port:'+app.get('port'));
})
