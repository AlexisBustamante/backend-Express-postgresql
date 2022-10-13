const { Model, DataTypes, Sequelize } = require('sequelize');
const { CUSTOMER_TABLE } = require('./customer.model');

const ORDER_TABLE = 'orders';

const OrderSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  customerId: {
    field: 'customer_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: CUSTOMER_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'createdAt',
    defaultValue: Sequelize.NOW,
  },
  total: {//para datos no muy grandes es una suma que obitne e total
    type: DataTypes.VIRTUAL,
    get() {
      //validé que los items existan.
      let go = typeof(this.items)==='undefined' ? false : true
      
      if (go) {
        if (this.items.length > 0) {
          return this.items.reduce((total, item) => {
            return total + (item.price * item.OrderProduct.amount);
          }, 0);
        }else{
          return 0
        }
      }else{
        return 0;
      }
    }

  }
}

class Order extends Model {

  static associate(models) {
    //una orden tiene solo 1 customer del
    this.belongsTo(models.Customer, {
      as: 'customer',
    });
    //relacion de muchos a muchos
    //una orden puede tener muchos productos
    //la relacion se resuelve por OrderProduct
    this.belongsToMany(models.Product, {
      as: 'items',
      through: models.OrderProduct,
      foreignKey: 'orderId',
      otherKey: 'productId'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ORDER_TABLE,
      modelName: 'Order',
      timestamps: false
    }
  }
}

module.exports = { Order, OrderSchema, ORDER_TABLE };
