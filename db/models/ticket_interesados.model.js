'use strict';
const { Model, DataTypes, Sequelize } = require('sequelize');

const TICKET_INTERESADOS_TABLE = 'ticket_interesados';
const Ticket_Ineteresados_Schema = {
  ticket_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
} ;

class Ticket_Interesados extends Model {
  static associate(models) {
    // Relación con la tabla Tickets
    this.belongsTo(models.Tickets, {
      foreignKey: 'ticket_id',
      as: 'tickets',
    });

    // Relación con la tabla Users
    this.belongsTo(models.User, {
      foreignKey: 'usuario_id',
      as: 'user',
    });
  }

    static config(sequelize) {
        return {
          sequelize,
          tableName: TICKET_INTERESADOS_TABLE,
          modelName: 'Ticket_interesados',
          timestamp: false
        }
      }
}

module.exports = { TICKET_INTERESADOS_TABLE, Ticket_Ineteresados_Schema, Ticket_Interesados }
