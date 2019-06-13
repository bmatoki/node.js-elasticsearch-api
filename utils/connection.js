const elasticsearch = require('elasticsearch');
const config = require('../config');

const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

// creating elastic search connection
const client = new elasticsearch.Client({
  host: config[env].db.option.es,
  log: config[env].db.option.log,
});

module.exports = client;
