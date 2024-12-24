const { Model, DataTypes, Sequelize } = require('sequelize');

// Nombre de la tabla en la BD
const INCIDENCIAS_TABLE = 'incidencias';

// Esquema de campos de la tabla
const IncidenciasSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  nombre: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  apellidos: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  tipo_evento: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  mensaje: {
    allowNull: false,
    type: DataTypes.TEXT,
  },
  createdAt: {
    allowNull: false,
    field: 'created_at',
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    allowNull: false,
    field: 'updated_at',
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
};

class Incidencias extends Model {
  static associate(models) {
    // Relaciones si son necesarias
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: INCIDENCIAS_TABLE,
      modelName: 'Incidencias',
      timestamp: false,
    };
  }
}

module.exports = { INCIDENCIAS_TABLE, IncidenciasSchema, Incidencias };