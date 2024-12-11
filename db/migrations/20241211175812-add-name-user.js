'use strict';
const { USER_TABLE } = require('./../models/user.model');

module.exports = {
  async up (queryInterface, Sequelize) {
 
     await queryInterface.addColumn(USER_TABLE,'name',
     {
        field: 'name',
        allowNull: true,
        type: Sequelize.DataTypes.STRING,   
     } );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(USER_TABLE,'name' );
  }
};
