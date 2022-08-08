const { Pool } = require('pg');
const { config } = require('../config/config');

//para enviar un url con el squema de conexion
//para proteger y seguridad
const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);

//para crear url de conexion //buena practica
const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbHost}/${config.dbName}`

const pool = new Pool({ connectionString: URI })
module.exports = pool
