module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    {
      name      : 'GEAS',
      script    : 'server/entrance/start.js',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'production'
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : 'root',
      host : '47.106.125.144',
      ref  : 'origin/master',
      repo : 'git@github.com:haochengz/geas.git',
      path : '/www/geas/production',
      'post-deploy' : 'cd source && cnpm install && pm2 startOrRestart ecosystem.config.js --env production',
      env  : {
        NODE_ENV: 'production'
      }
    },
    dev : {
      user : 'root',
      host : '47.106.125.144',
      ref  : 'origin/master',
      repo : 'git@github.com:haochengz/geas.git',
      path : '/www/geas/development',
      'post-deploy' : 'cnpm install && pm2 startOrRestart ./source/ecosystem.config.js --env dev',
      env  : {
        NODE_ENV: 'dev'
      }
    }
  }
}
