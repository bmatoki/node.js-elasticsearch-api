module.exports = {
  apps: [
    {
      name: 'elk-log-reader',
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