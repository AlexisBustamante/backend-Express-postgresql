'use strict';
const { USER_TABLE } = require('./../models/user.model');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(USER_TABLE, 'estado', {
      allowNull: false, // No permitir nulos para asegurar que siempre tenga un valor
      type: Sequelize.DataTypes.INTEGER, // Tipo de dato 
      defaultValue: 0, // Valor por defecto 0 (activo)
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(USER_TABLE, 'estado');
  }
};
