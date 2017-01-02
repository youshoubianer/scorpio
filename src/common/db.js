'use strict';

const Sequelize = require('sequelize');

module.exports =  new Sequelize(config.database.database, config.database.username, config.database.password, {
  dialect: config.database.dialect,
  host: config.database.host,
  port: config.database.port,
  // timezone: '+08:00',
  define: { 
    timestamps: false,
  },
  pool: {
    maxConnections: config.database.pool,
  },
  omitNull: true,
  option:{
    logging: config.database.logging,
  }
});