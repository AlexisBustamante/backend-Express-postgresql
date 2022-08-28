const { DataTypes } = require('sequelize');


'use strict';
const { CustomerSchema, CUSTOMER_TABLE } = require('./../models/customer.model');
module.exports = {
  async up(queryInterface, Sequelize) {
    //aca creara las tablas.
    await queryInterface.changeColumn(CUSTOMER_TABLE, 'user_id', {
      field: 'user_id',
      allowNull: false,
      type: DataTypes.INTEGER,
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    //down, permite revertir los cambios
    //await queryInterface.dropTable(CUSTOMER_TABLE);
  }
};
