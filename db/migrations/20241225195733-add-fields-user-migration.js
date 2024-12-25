'use strict';
const { USER_TABLE } = require('./../models/user.model');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(USER_TABLE, 'lastName', 
      {
        field: 'lastName',
        allowNull: true,
        type: Sequelize.DataTypes.STRING,   
     });
     await queryInterface.addColumn(USER_TABLE, 'avatar', {
        field: 'avatar',
        allowNull: true,
        type: Sequelize.DataTypes.STRING,   
     }    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn(USER_TABLE, 'lastName');
    await queryInterface.removeColumn(USER_TABLE, 'avatar');
  },   

};
