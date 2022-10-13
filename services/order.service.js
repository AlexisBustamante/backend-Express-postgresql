const boom = require('@hapi/boom');
const pool = require('../libs/postgres.pool');
const { models } = require('../libs/sequelize');

class OrderService {
  constructor() {
    this.pool = pool;
    this.pool.on('error', (err) => console.error(err));//aca  //se deja escuchando algun error que pueda existir en la conx del Poo
  }

  async create(data) {
    const newOrder = await models.Order.create(data)
    return newOrder;
  }

  async find() {
    const orders = await models.Order.findAll({
      include: ['customer']
    })
    return orders;
  }
  async addItem(data) {
    const newItem = await models.OrderProduct.create(data);
    return newItem;
  }

  async findOne(id) {
    //aca se va del nivel customer a usuar dentro de la orden
    const order = await models.Order.findByPk(id, {
      include:
        [{
          association: 'customer',
          include: ['user']
        },
          'items'
        ]
    })
    return order;
  }

  async update(id, changes) {
    return {
      id,
      changes,
    };
  }

  async delete(id) {
    return { id };
  }
//search all orders by user where relatinship is the user with customer
//pasa de customer a usuario y compara el id
  async findByUser(userId) {
    const orders = await models.Order.findAll(
      {
        where:{
          '$customer.user.id$': userId
        },
        include:
        [{
          association: 'customer',
          include: ['user']
        }
        ]
      }
    );

    return orders;
  }
}

module.exports = OrderService;
