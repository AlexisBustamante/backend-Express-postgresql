const { Pool } = require('pg');
const { config } = require('../config/config');

let URI = ''
if (config.isProd) {
  URI = config.dbUrl;
} else {
  //para enviar un url con el squema de conexion
  //para proteger y seguridad
  const USER = encodeURIComponent(config.dbUser);
  const PASSWORD = encodeURIComponent(config.dbPassword);
  URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`
}

//para crear url de conexion //buena practica
///se crea el pool de conexion
const pool = new Pool({ connectionString: URI })
module.exports = pool
