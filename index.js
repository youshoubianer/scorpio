'use strict'

require('./bin/load_global')
const ctrl = require('./src/ctrl')

co(function*(){
  yield ctrl.begin();
})