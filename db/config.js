const { config } = require('../config/config');

module.exports = {
  development: {
    dialect: 'postgres',
    url: config.dbUrl,
  },
  production: {
    dialect: 'postgres',
    url: config.dbUrl,
    ssl: {
      rejectUnauthorized: false
    }
  }
}
