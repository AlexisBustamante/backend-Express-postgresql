'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('marcaciones', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fecha: {
        type: Sequelize.DATEONLY, // Solo la fecha (sin hora)
        allowNull: false,
      },
      hora: {
        type: Sequelize.TIME, // Hora de la marcación
        allowNull: false,
      },
      tipo: {
        type: Sequelize.ENUM('entrada', 'salida_almuerzo', 'entrada_almuerzo', 'salida'),
        allowNull: false,
      },
      geolocalizacion: {
        type: Sequelize.STRING, // Coordenadas GPS (latitud, longitud)
        defaultValue: '0,0', // Valor por defecto si no se proporciona
      },
      usuario_id: {
        type: Sequelize.INTEGER, // Relación con el usuario
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        field: 'createdAt',
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        field: 'updatedAt',
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('marcaciones');
  },
};
