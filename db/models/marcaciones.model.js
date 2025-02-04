const { Model, DataTypes, Sequelize } = require('sequelize');
const MARCACIONES_TABLE = 'marcaciones';

const MarcacionesSchema = {
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
      observacion: {
        type: Sequelize.STRING,
        allowNull: true,
      },
}


class Marcaciones extends Model {

  static associate(models) {
    //this.belongsTo(models.Category, { as: 'category' });

    this.belongsTo(models.User, {
        foreignKey: 'usuario_id',
        as: 'users',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: MARCACIONES_TABLE,
      modelName: 'Marcaciones',
      timestamps: true
    }
  }
}

module.exports = { Marcaciones, MarcacionesSchema, MARCACIONES_TABLE };
