const { User, UserSchema } = require('./user.model');
//aca se cargaran todos los modelos de las tablas y esquemas
function setupModels(sequelize) {
  User.init(UserSchema, User.config(sequelize));
}

module.exports = setupModels;
