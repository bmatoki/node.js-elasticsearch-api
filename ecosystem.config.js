module.exports = {
  apps: [
    {
      name: 'v5-log-insert',
      script: 'app.js',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8080,
        COMPANY: '{company_name_here}',
      },
    },
  ],

};