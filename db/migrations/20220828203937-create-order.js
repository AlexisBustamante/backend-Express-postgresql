'use strict';
const { OrderSchema, ORDER_TABLE } = require('./../models/order.model');
module.exports = {
  async up(queryInterface, Sequelize) {
    //aca creara las tablas.
    await queryInterface.createTable(ORDER_TABLE, OrderSchema);
  },

  async down(queryInterface, Sequelize) {
    //down, permite revertir los cambios
    await queryInterface.dropTable(ORDER_TABLE);
  }
};
