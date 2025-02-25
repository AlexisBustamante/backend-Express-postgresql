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
  name:{
    allowNull: false,
    type: DataTypes.STRING,
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
  recoveryToken: {
    field: 'recoveryToken',
    allowNull: true,
    type: DataTypes.STRING,
  },
  createdAt: {
    allowNull: false,
    field: 'createdAt',
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    allowNull: false,
    field: 'updatedAt',
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  avatar:{
    field: 'avatar',
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: ''
  },
  lastName:{
    field: 'lastName',
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: ''
  },
  estado:{
    field: 'estado',
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastName2:{
    field: 'lastName2',
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: ''
  },
  rut:{
    field: 'rut',
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: ''
  },
  cargo_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Cargos', // Hace referencia a la tabla Cargos
      key: 'id'
    }
  },
  centro_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Centros', // Hace referencia a la tabla Cargos
      key: 'id'
    }
  },
  horas_servicio: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}

class User extends Model {
  static associate(models) {
    //relaciones
    this.hasOne(models.Customer,
      {
        as: 'customer',
        foreignKey: 'userId'
      });

      this.belongsTo(models.Cargos, {  // Cambiado a belongsTo porque User pertenece a Cargo
        as: 'cargos', // El alias que usarás para referenciar a cargo
        foreignKey: 'cargo_id', // Este es el campo en 'User' que tiene la clave foránea
      });

      this.belongsTo(models.Centros, {  // Cambiado a belongsTo porque User pertenece a Cargo
        as: 'centros', // El alias que usarás para referenciar a cargo
        foreignKey: 'centro_id', // Este es el campo en 'User' que tiene la clave foránea
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
