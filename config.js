module.exports = {
  production: {
    db: {
      option: {
        es: 'localhost:9200',
        log: 'warning',
      },
    },
    logger: {
      morganLevel: 'tiny',
      level: 'info',
    },
    cors: {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    },
    mail: {
      smtp: 'smtp.gmail.com',
      ssl: true,
      port: 465,
      username: '',
      password: '',
      techadmin: '',
      errorAlertThershold: 10,
      alertFrequency: '0 0 */1 * * *', // cron syntax sec min hour days etc
    },
  },
  development: {
    db: {
      option: {
        es: '',
        log: 'warning',
      },
    },
    logger: {
      morganLevel: 'dev',
      level: 'debug',
    },
    cors: {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    },
    mail: {
      smtp: 'smtp.gmail.com',
      ssl: true,
      port: 465,
      username: '',
      password: '',
      techadmin: '',
      errorAlertThershold: 10,
      alertFrequency: '0 0 */1 * * *', // cron syntax sec min hour days etc
    },
  },
  test: {
    db: {
      option: {
        es: '',
        log: 'warning',
      },
    },
    logger: {
      morganLevel: 'dev',
      level: 'debug',
    },
    mail: {
      smtp: 'smtp.gmail.com',
      ssl: true,
      port: 465,
      username: '',
      password: '',
      techadmin: '',
      errorAlertThershold: 10,
      alertFrequency: '0 0 */1 * * *', // cron syntax sec min hour days etc
    },
    test: {
      decryptHash: '',
    },
  },
};
