const bodybuilder = require('bodybuilder');
const log = require('./logger');
const cacheUtil = require('./cache.util');

// creating term filter from the object with body builder
function createFiltersFromObject(filtersObj) {
  log.info('validate.util createFiltersFromObject() started.');
  try {
    log.info(`validate.util createFiltersFromObject() - filter object is ${JSON.stringify(filtersObj)}`);
    const body = bodybuilder();
    // for each on all keys.
    Object.keys(filtersObj).forEach((key) => {
      body.filter('term', key, filtersObj[key]);
    });
    // in case you want to do range query add the following line:
    // body.filter('range', '@timestamp', {
    //   gte: indexRange.from,
    //   lte: indexRange.to,
    //   format: 'yyyy.MM.dd',
    //   time_zone: '+03:00',
    // });
    body.sort('@timestamp', 'desc');
    return body;
  } catch (error) {
    cacheUtil.incrementErrorCount(error.message || error);
    log.info(`validate.util createFiltersFromObject() error: ${error}`);
  } finally {
    log.info('validate.util createFiltersFromObject() ended.');
  }
}

module.exports = {
  createFiltersFromObject,
};
