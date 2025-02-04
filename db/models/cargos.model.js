const { Model, DataTypes, Sequelize } = require('sequelize');
const CARGO_TABLE = 'cargos';

const CargoSchema = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nombre: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    // createdAt: {
    //   allowNull: false,
    //   type: DataTypes.DATE,
    //   field: 'createdAt',
    //   defaultValue: Sequelize.NOW,
    // }
  };

  class Cargos extends Model {
    static associate(models) {
     
    }
  
    static config(sequelize) {
      return {
        sequelize,
        tableName: CARGO_TABLE,
        modelName: 'Cargos',
        timestamps: false
      };
    }
  }

  module.exports = { Cargos, CargoSchema,CARGO_TABLE };
  