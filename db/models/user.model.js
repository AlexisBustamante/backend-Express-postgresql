const { Model, DataTypes, Sequelize } = require('sequelize');

//nombre d ela tabla en la BD
const USER_TABLE = 'users';

//esquema de campos de la tabla
const UserSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true
  },
  role: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: 'customer'
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  createdAt: {
    allowNull: false,
    field: 'created_at',
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
}

class User extends Model {
  static associate(models) {
    //relaciones
    this.hasOne(models.Customer,
      {
        as: 'customer',
        foreignKey: 'userId'
      });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: 'User',
      timestamp: false
    }
  }
}

module.exports = { USER_TABLE, UserSchema, User }
