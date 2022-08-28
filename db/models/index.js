const { User, UserSchema } = require('./user.model');
const { Customer, CustomerSchema } = require('./customer.model');

//aca se cargaran todos los modelos de las tablas y esquemas
function setupModels(sequelize) {
  User.init(UserSchema, User.config(sequelize));
  Customer.init(CustomerSchema, Customer.config(sequelize));

  //asociar las relaciones en la iniciación
  Customer.associate(sequelize.models);
}

module.exports = setupModels;
