const { Pool } = require('pg');
const { config } = require('../config/config');
const options = {};

if (config.isProd) {
  URI = config.dbUrl;
  options.connectionString = config.dbUrl;
  config.ssl = {
    rejectUnauthorized: false
  }
} else {
  //para enviar un url con el squema de conexion
  //para proteger y seguridad
  const USER = encodeURIComponent(config.dbUser);
  const PASSWORD = encodeURIComponent(config.dbPassword);
  const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`
  options.connectionString = URI;
}

//para crear url de conexion //buena practica
///se crea el pool de conexion
const pool = new Pool(options)
module.exports = pool
