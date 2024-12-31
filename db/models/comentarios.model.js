'use strict';
const { Model, DataTypes, Sequelize } = require('sequelize');

const COMENTARIOS_TABLE = 'comentarios'
const ComentariosSchema =  {
  ticket_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  tiempo_empleado: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  createdAt: {
    allowNull: false,
    field: 'createdAt',
    type: Sequelize.DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    allowNull: false,
    field: 'updatedAt',
    type: Sequelize.DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
};

class Comentarios extends Model {
  static associate(models) {
    // Relación con la tabla Tickets
    this.belongsTo(models.Tickets, {
      foreignKey: 'ticket_id',
      as: 'ticket',
    });

    // Relación con la tabla Users
    this.belongsTo(models.User, {
      foreignKey: 'usuario_id',
      as: 'users',
    });
  }

  static config(sequelize) {
      return {
        sequelize,
        tableName: COMENTARIOS_TABLE,
        modelName: 'Comentarios',
        timestamp: true
      }
    }

}

module.exports = { COMENTARIOS_TABLE, ComentariosSchema, Comentarios }
