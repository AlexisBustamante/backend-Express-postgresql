const { Model, DataTypes, Sequelize } = require('sequelize');

const CENTRO_TABLE = 'centros';

const CentrosSchema = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    geolocalizacion: {
      type: Sequelize.STRING, // Coordenadas GPS (latitud, longitud)
      defaultValue: '0,0', // Valor por defecto si no se proporciona
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'createdAt',
      defaultValue: Sequelize.NOW,
    }
  };

  class Centros extends Model {
    static associate(models) {
     
    }
  
    static config(sequelize) {
      return {
        sequelize,
        tableName: CENTRO_TABLE,
        modelName: 'Centros',
        timestamps: false
      };
    }
  }

  module.exports = { Centros, CentrosSchema, CENTRO_TABLE };