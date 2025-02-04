'use strict';
const { MARCACIONES_TABLE } = require('./../models/marcaciones.model');

module.exports = {
  async up (queryInterface, Sequelize) {
 
     await queryInterface.addColumn(MARCACIONES_TABLE,'observacion',
      {
        field: 'name',
        allowNull: true,  // Permite que sea NULL, pero no será NULL por defecto
        type: Sequelize.DataTypes.STRING,
        defaultValue: ""  // Valor por defecto vacío
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(MARCACIONES_TABLE,'observacion' );
  }
};
