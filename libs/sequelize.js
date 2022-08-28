const { Sequelize } = require('sequelize');
const { config } = require('../config/config');
const setupModels = require('../db/models');

//para enviar un url con el squema de conexion
//para proteger y seguridad
const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);

//para crear url de conexion //buena practica
const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`

//instancia de squelize con la conexion
const sequelize = new Sequelize(URI, {
  dialect: 'postgres',
  logging: true,
});

setupModels(sequelize);
//aca se sincroniza leera el modelo y creará la tabla y relaciones.
//sequelize.sync();
//conexion con sequelize
module.exports = sequelize;
