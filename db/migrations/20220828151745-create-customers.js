'use strict';
const { CustomerSchema, CUSTOMER_TABLE } = require('./../models/customer.model');
module.exports = {
  async up(queryInterface, Sequelize) {
    //aca creara las tablas.
    await queryInterface.createTable(CUSTOMER_TABLE, CustomerSchema);
  },

  async down(queryInterface, Sequelize) {
    //down, permite revertir los cambios
    await queryInterface.dropTable(CUSTOMER_TABLE);
  }
};
