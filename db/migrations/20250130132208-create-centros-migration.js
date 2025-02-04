module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('centros', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nombre: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      direccion: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      geolocalizacion: {
        type: Sequelize.STRING, // Coordenadas GPS (latitud, longitud)
        defaultValue: '0,0', // Valor por defecto si no se proporciona
      },
      telefono: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('centros');
  }
};