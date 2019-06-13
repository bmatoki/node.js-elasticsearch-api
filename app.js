const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const config = require('./config');
const log = require('./utils/logger');
const client = require('./utils/connection');
const logRouter = require('./routes/log');
const emailUtil = require('./utils/email.util');
const cronJob = require('./utils/cron.util');
const cacheUtil = require('./utils/cache.util');

const PORT = process.env.PORT || 3000;

const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
log.info(`app: Starting in [${env}] mode`);

const app = express();
log.info(`app: Setting up cors with options ${JSON.stringify(config[env].cors)}`);
app.use(cors(config[env].cors));
// Middlewares
log.info('app: Loading middlewares');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
log.info(`app: Setting up morgan level ${config[env].logger.morganLevel}`);
app.use(morgan(config[env].logger.morganLevel, { stream: log.stream }));
// Node Routes
app.use('/api/log', logRouter);
log.info('app: Finished loading middlewares');


// Start the server
app.listen(PORT, () => {
  log.info(`App listening on port ${PORT}`);
});


// Checking elastic health
client.cluster.health({}, async (error, response, status) => {
  log.info(`Client health: ${JSON.stringify(response, status)}`);
  if (error) {
    log.error(`Client health error: ${JSON.stringify(error)}`);
    await emailUtil.sendAlertMail(`${process.env.COMPANY || 'DEV'} log reader error ${error}`);
  }
});

// Inform if elastic down or up.
client.ping({ requestTimeout: 30000 }, async (error) => {
  if (error) {
    log.error(`Elastic is down error: ${error}`);
    await emailUtil.sendAlertMail(`${process.env.COMPANY || 'DEV'} log reader error ${error}`);
  } else { log.info(`Successfully connected to ${config[env].db.option.es} -> elastic is up`); }
});

// Catch all unhandled rejections and log
process.on('unhandledrejection', async (reason) => {
  cacheUtil.incrementErrorCount(reason.stack || reason);
  log.error(` Unhandled Rejection at: ${reason.stack || reason}`);
  await emailUtil.sendAlertMail(`${process.env.COMPANY || 'DEV'} log reader Unhandled Rejection  `, `Unhandled Rejection at: ${reason.stack || reason}`);
});


// Testing module
module.exports = app;
