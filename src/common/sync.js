'use strict'

const SequelizeAuto = require('sequelize-auto')

module.exports = function(){
  var options = {
    'host': config.database.host,
    'port': config.database.port,
    'dialect': config.database.dialect,
    'directory': __dirname + '/../schemes',
  }
  
  if(process.argv.slice(3).length > 0){
    options['tables'] = process.argv.slice(3)
  }

  var auto = new SequelizeAuto(config.database.database, config.database.username, config.database.password,options);

  auto.run(function (err) {
    if (err) throw err;
    console.log('done!');
  });
}