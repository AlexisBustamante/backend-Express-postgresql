'use strict';
const { OrderProductSchema, ORDER_PRODUCT_TABLE } = require('./../models/order-product.model');
module.exports = {
  async up(queryInterface, Sequelize) {
    //aca creara las tablas.
    //nm tabl, schema
    await queryInterface.createTable(ORDER_PRODUCT_TABLE, OrderProductSchema);
  },

  async down(queryInterface, Sequelize) {
    //down, permite revertir los cambios
    await queryInterface.dropTable(ORDER_PRODUCT_TABLE);
  }
};
