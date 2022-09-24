'use strict';
const { OrderSchema, ORDER_TABLE } = require('./../models/order.model');
const { CUSTOMER_TABLE } = require('./../models/customer.model');
const { Model, DataTypes, Sequelize } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    //aca creara las tablas.
    await queryInterface.createTable(ORDER_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      customerId: {
        field: 'customer_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: CUSTOMER_TABLE,
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW,
      },

    });
  },

  async down(queryInterface, Sequelize) {
    //down, permite revertir los cambios
    await queryInterface.dropTable(ORDER_TABLE);
  }
};
