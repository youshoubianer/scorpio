'use strict'

//配置
global.config = require('../src/common/config.js')

//依赖
global.co = require('co')

const Nightmare = require('nightmare')
global.nightmare = Nightmare({ 
  show: true,
  openDevTools: {
   mode: 'bottom'
  }
})