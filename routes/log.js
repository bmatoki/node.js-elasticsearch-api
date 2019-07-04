const express = require('express');
const bodybuilder = require('bodybuilder');
const client = require('../utils/connection');
const validateUtils = require('../utils/validate.util');
const log = require('../utils/logger');
const cacheUtil = require('../utils/cache.util');

const router = express.Router();

// get 1k logs from today index.
async function getAllLogsFromToday(req, res) {
  log.info('Log route: /log/all getAllLogsFromToday() Started');
  try {
    const { index } = req.body;
    const query = await client.search({
      index,
      type: 'doc',
      size: '10000',
      body: bodybuilder()
        .query('match_all')
        .sort('@timestamp', 'desc')
        .build(),
    });
    return res.status(200).json({
      success: true,
      msg: query,
    });
  } catch (error) {
    log.error(`Log route: /log/all getAllLogsFromToday() error: ${error}`);
    cacheUtil.incrementErrorCount(error.message || error);
    return res.status(400).json({
      success: false,
      msg: `Error : ${error}`,
    });
  } finally {
    log.info('Log route: /log/all getAllLogsFromToday () Ended');
  }
}

// simple query string with free text flags included.
async function freeQueryString(req, res) {
  log.info('Log route: /log/text freeQueryString() Started');
  try {
    const { index } = req.body;
    const query = await client.search({
      index,
      type: 'doc',
      size: '10000',
      body: bodybuilder()
        .query('simple_query_string', 'query', `${req.body.filter}`, {
          flags: 'OR|AND|NOT',
        })
        .sort('@timestamp', 'desc')
        .build(),
    });
    return res.status(200).json({
      success: true,
      msg: query,
    });
  } catch (error) {
    log.error(`Log route: /log/text freeQueryString()  error: ${error}`);
    cacheUtil.incrementErrorCount(error.message || error);
    return res.status(400).json({
      success: false,
      msg: `Error : ${error}`,
    });
  } finally {
    log.info('Log route: /log/text freeQueryString() Ended');
  }
}

// query with specifics filters
async function getLogsBySpecificFilters(req, res) {
  log.info('Log route: /log/filters getLogsBySpecificFilters() Started');
  try {
    // call to create filter util - must be at specific syntax.
    const { index } = req.body;
    const filters = validateUtils.createFiltersFromObject(req.body.filter);
    const query = await client.search({
      index,
      type: 'doc',
      size: '10000',
      body: filters.build(),
    });

    return res.status(200).json({
      success: true,
      msg: query,
    });
  } catch (error) {
    log.error(`Log route: /log/filters getLogsBySpecificFilters()  error: ${error}`);
    cacheUtil.incrementErrorCount(error.message || error);
    return res.status(400).json({
      success: false,
      msg: `Error : ${error}`,
    });
  } finally {
    log.info('Log route: /log/filters getLogsBySpecificFilters() Ended');
  }
}

// return all  username.keyword for filter auto complete
async function getAllTextPrediction(req, res) {
  log.info('Log route: /log/filters/all getAllTextPrediction () Started');
  try {
    const queryUserName = await client.search({
      body: {
        aggs: {
          user_name: {
            terms: { field: 'user_name.keyword', size: 10000 },
          },
        },
        size: 0,
      },
    });
    return res.json({
      success: true,
      msg: {
        queryUserName,
      },
    });
  } catch (error) {
    log.error(`Log route: /log/filters/all getAllTextPrediction() error: ${error}`);
    cacheUtil.incrementErrorCount(error.message || error);
    return res.json({
      success: false,
      msg: `Error : ${error}`,
    });
  } finally {
    log.info('Log route: /log/filters/all getAllTextPrediction () Ended');
  }
}

// /log/_ routes
router.get('/log/filters/all', getAllTextPrediction);
router.get('/all', getAllLogsFromToday);
router.post('/text', freeQueryString);
router.post('/filters', getLogsBySpecificFilters);
module.exports = router;
