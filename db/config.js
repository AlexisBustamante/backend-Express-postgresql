const { config } = require('../config/config');
const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);

//para crear url de conexion //buena practica
const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`

module.exports = {
  development: {
    dialect: 'postgres',
    url: URI,
  },
  production: {
    dialect: 'postgres',
    url: URI,
  }
}
