process.env.NODE_ENV = 'test';
const env = process.env.NODE_ENV;
process.env.PORT = 5050;
const mocha = require('mocha');


const describe = mocha.describe;
const it = mocha.it;
const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('../config')[env];

chai.use(chaiHttp);
chai.should();
const app = require('../app');
const cacheUtil = require('../utils/cache.util');
const hashUtil = require('../utils/hash.util');
const emailUtil = require('../utils/email.util');

// check db - elastic connection.
describe('Check elastic connection', () => {
  it(`route GET ${config.db.option.es} should return status 200 and elastic object `, async () => {
    const result = await chai.request(config.db.option.es).get('/').send();
    chai.expect(result).to.be.an('object');
    chai.expect(result).to.have.property('status').eql(200);
  });
});

// check all routes at log reader.
describe('Check routes', () => {
  it('route GET /log/all should return all logs ', async () => {
    const result = await chai.request(app).get('/log/all').send();
    chai.expect(result).to.have.property('status').eql(200);
  });
  it('route post /log/filters should return all logs by status ', async () => {
    const body = {
      'status.keyword': 'OK',
    };
    const result = await chai.request(app).post('/log/filters').send(body);
    chai.expect(result).to.have.property('status').eql(200);
  });
  it('route post /log/text should return all logs by status ', async () => {
    const filter = 'chrome.exe';
    const result = await chai.request(app).post('/log/filters').send(filter);
    chai.expect(result).to.have.property('status').eql(200);
  });
});

// check cache util
describe('Check cache.util', () => {
  let errorCount = -1;
  it('should return cache error count 0', () => {
    errorCount = cacheUtil.getErrorCount();
    chai.expect(errorCount).to.eql(0);
  });
  it('should increment error count', () => {
    cacheUtil.incrementErrorCount();
    errorCount = cacheUtil.getErrorCount();
    chai.expect(errorCount).to.eql(1);
  });
  it('should set error count to 0', () => {
    cacheUtil.clearErrorCount();
    errorCount = cacheUtil.getErrorCount();
    chai.expect(errorCount).to.eql(0);
  });
});

// check hash util - if decrypt hash work.
describe('Check hash.util', () => {
  it('should decrypt', () => {
    const result = hashUtil.decrypt(config.test.decryptHash);
    chai.expect(result).to.eql('test@123');
  });
});

// check email util - send test mail.
describe('check email.util', () => {
  it('should send alert mail', async () => {
    const result = await emailUtil.sendAlertMail('TEST EMAIL SUBJECT', 'TEST EMAIL BODY');
    /* eslint-disable */
    console.log(result.success);
    console.log(result.msg);
    /* eslint-enable */
    chai.expect(result).to.have.property('success').eql(true);
  });
});
