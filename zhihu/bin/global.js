'use strict';
//配置
global.config = require('../src/common/config.js');

//依赖
global.request = require('request').defaults({jar: true});
global.co = require('co');
global._ = require('lodash');
require('../src/common/lodash_extends');


//redis database
const bluebird = require('bluebird');
const redis = require('redis');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
global.redisClient = redis.createClient(config.redis.port, config.redis.host);

global.crawer = require('../src/crawer');
