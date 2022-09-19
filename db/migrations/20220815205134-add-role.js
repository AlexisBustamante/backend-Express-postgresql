'use strict';
const { USER_TABLE } = require('./../models/user.model');
const { DataTypes, Sequelize } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(USER_TABLE, 'role', {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: 'customer'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(USER_TABLE, 'role');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
