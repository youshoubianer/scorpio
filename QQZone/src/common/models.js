'use strict';

const fs = require('fs')
const path = require('path')

const sequelize = db;

fs
  .readdirSync(__dirname + '/../schemes')
  .filter(function(file) {
    return file.indexOf('.') !== 0 && file !== 'index.js'
  })
  .forEach(function(file) {
    var model = sequelize.import(__dirname+'/' + file);
    module.exports[_.toCamel(model.name)] = model
  });

return sequelize.sync().then(function() {
  module.exports.sequelize = sequelize
});