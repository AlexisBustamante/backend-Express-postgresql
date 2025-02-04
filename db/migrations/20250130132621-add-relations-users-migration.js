module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('users', 'rut', {
      type: Sequelize.STRING(10),
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'lastName2', {
      type: Sequelize.STRING(10),
      allowNull: true,
    });
    
    await queryInterface.addColumn('users', 'cargo_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'cargos',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
    
    await queryInterface.addColumn('users', 'centro_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'centros',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'cargo_id');
    await queryInterface.removeColumn('users', 'centro_id');
  }
};