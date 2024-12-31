'use strict';
const { Model, DataTypes, Sequelize } = require('sequelize');


//nombre d ela tabla en la BD
const TICKET_TABLE = 'tickets';
const TicketsSchema =   {
  id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    descripcion: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    responsable_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
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
    estado: {
      type: Sequelize.STRING,
      allowNull: false,
    },
};


class Tickets extends Model {
  static associate(models) {
      // Relación con la tabla Users (responsable)
      this.belongsTo(models.User, {
          foreignKey: 'responsable_id',
          as: 'responsable',
      });

      // Relación con la tabla Ticket_Interesados
      this.hasMany(models.Ticket_interesados, {
          foreignKey: 'ticket_id',
          as: 'ticket_interesados',
      });

      // Relación con la tabla Comentarios
      this.hasMany(models.Comentarios, {
          foreignKey: 'ticket_id',
          as: 'comentarios',
      });
  }

  static config(sequelize) {
      return {
        sequelize,
        tableName: TICKET_TABLE,
        modelName: 'Tickets',
        timestamp: false
      }
    }
}

module.exports = { TICKET_TABLE, TicketsSchema, Tickets }

