'use strict'

//配置
global.config = require('../src/common/config.js');

//依赖
global.request = require('request').defaults({jar: true});
global.co = require('co');
global._ = require('lodash');
require('../src/common/lodash_extends');

const Nightmare = require('nightmare');
global.nightmare = Nightmare({ 
  show: true,
  openDevTools: {
   mode: 'bottom'
  }
});

global.util = require('../src/common/util.js');

//数据模型
global.db = require('../src/common/db');
global.models = require('../src/common/models');
