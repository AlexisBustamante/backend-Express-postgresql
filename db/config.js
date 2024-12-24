const { config } = require('./../config/config');
//si da error de dialect al ejecutar migracion 
//ejecutar docker contenedor
//echo $NODE_ENV
//export NODE_ENV=development
module.exports = {
  development: {
    url: config.dbUrl,
    dialect: 'postgres',
    dialectOptions: {
      // ssl: {
      //   rejectUnauthorized: false
      // }
    }
  },
  production: {
    url: config.dbUrl,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  }
}