const faker = require('faker');
const boom = require('@hapi/boom');
const { Op } = require('sequelize');//operadores
const { models } = require('../libs/sequelize');

const { TicketsSchema } = require('../db/models/tickets.model');

class Tickets {
  constructor() {

  }
//   async create(data) {
//     const newProduct = await models.Product.create(data);
//     return newProduct;
//   }

  async find(query) {
    const options = {
      include: [
        {
          model:models.Ticket_interesados,
          as:'ticket_interesados',
          attributes:['usuario_id'],
          include: [
            {
              model: models.User, // Relación con User
              as: 'user', // Alias definido en el modelo Ticket_interesados
              attributes:['id','name','lastName','avatar','role','email']
            }]
        },
        {
          model:models.User,
          as:'responsable',
          attributes:['id','name','lastName','avatar','role','email']
        }
        ],
      where: {}
    }
    //console.log(models);
    const tickets = await models.Tickets.findAll(options);
    return tickets;
  }



//   async findOne(id) {
//     const product = await models.Products.findByPk(id);
//     if (!product) {
//       throw boom.notFound('product not found');
//     }
//     if (product.isBlock) {
//       throw boom.conflict('product is block');
//     }
//     return product;
//   }

//   async update(id, changes) {
//     const model = await this.findOne(id);
//     const product = await model.update(changes);
//     if (!product) {
//       throw boom.notFound('product not found');
//     }
//     return product;
//   }

//   async delete(id) {
//     const product = await this.findOne(id);
//     await product.destroy();
//     return { rta: true };
//   }

}

module.exports = Tickets;
