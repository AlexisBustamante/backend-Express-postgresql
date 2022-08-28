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

  async findOne(id) {
    //aca se va del nivel customer a usuar dentro de la orden
    const order = await models.Order.findByPk(id, {
      include:
        [{
          association: 'customer',
          include: ['user']
        }]
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

}

module.exports = OrderService;
