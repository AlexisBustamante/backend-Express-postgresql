const { User, UserSchema } = require('./user.model');
const { Customer, CustomerSchema } = require('./customer.model');
const { Category, CategorySchema } = require('./category.model');
const { Product, ProductSchema } = require('./product.model');
const { Order, OrderSchema } = require('./order.model');
const { OrderProduct, OrderProductSchema } = require('./order-product.model');
const { Incidencias, IncidenciasSchema } = require('./incidencias.model');
const { Tickets, TicketsSchema } = require('./tickets.model');
const { Comentarios, ComentariosSchema } = require('./comentarios.model');
const { Ticket_Interesados, Ticket_Ineteresados_Schema } = require('./ticket_interesados.model');
const { Marcaciones, MarcacionesSchema } = require('./marcaciones.model');
const { Cargos, CargoSchema, CARGO_TABLE} = require('./cargos.model');
const { Centros, CentrosSchema, CENTROS_TABLE} = require('./centros.model');

//aca se cargaran todos los modelos de las tablas y esquemas
function setupModels(sequelize) {
  User.init(UserSchema, User.config(sequelize));
  Customer.init(CustomerSchema, Customer.config(sequelize));
  Category.init(CategorySchema, Category.config(sequelize));
  Product.init(ProductSchema, Product.config(sequelize));
  Order.init(OrderSchema, Order.config(sequelize));
  OrderProduct.init(OrderProductSchema, OrderProduct.config(sequelize));
  Incidencias.init(IncidenciasSchema,Incidencias.config(sequelize));
  Tickets.init(TicketsSchema,Tickets.config(sequelize));
  Comentarios.init(ComentariosSchema,Comentarios.config(sequelize));
  Ticket_Interesados.init(Ticket_Ineteresados_Schema,Ticket_Interesados.config(sequelize));
  Marcaciones.init(MarcacionesSchema,Marcaciones.config(sequelize));
  Cargos.init(CargoSchema,Cargos.config(sequelize));
  Centros.init(CentrosSchema,Centros.config(sequelize));

  // Centros.init(CentrosSchema,Centros.config(sequelize));
  //asociar las relaciones en la iniciación
  User.associate(sequelize.models);
  Customer.associate(sequelize.models);
  Category.associate(sequelize.models);
  Product.associate(sequelize.models);
  Order.associate(sequelize.models);
  Tickets.associate(sequelize.models);
  Comentarios.associate(sequelize.models);
  Ticket_Interesados.associate(sequelize.models);
  Marcaciones.associate(sequelize.models);
  Cargos.associate(sequelize.models);
  Centros.associate(sequelize.models);
}

module.exports = setupModels;
