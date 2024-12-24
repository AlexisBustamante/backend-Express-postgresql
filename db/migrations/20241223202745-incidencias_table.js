'use strict';

const { INCIDENCIAS_TABLE } = require('../models/incidencias.model');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(INCIDENCIAS_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      nombre: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      apellidos: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      email: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      tipo_evento: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      mensaje: {
        allowNull: false,
        type: Sequelize.DataTypes.TEXT,
      },
      created_at: {
        allowNull: false,
        field: 'created_at',
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        allowNull: false,
        field: 'updated_at',
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable(INCIDENCIAS_TABLE);
  },
};
