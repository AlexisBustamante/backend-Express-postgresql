const faker = require('faker');
const boom = require('@hapi/boom');
const { Op } = require('sequelize');//operadores
const { models } = require('../libs/sequelize');

const { TicketsSchema } = require('../db/models/tickets.model');

class Tickets {
  constructor() {

  }

  async create(data) {
    const newrecord = {
      titulo:data.titulo,
      descripcion:data.descripcion,
      responsable_id:data.responsable_id,
      estado:'Abierto'
    }
    const ticket = await models.Tickets.create(newrecord);
    return ticket;
  }

  async find(query = {}) {
    //console.log(query);
    let where = {};//aca podemos ir agregando los filtros que necesitemos
    if (query.usuario_id != null)  {
      where.responsable_id = query.usuario_id
    }
    if (query.id != null) {
      where.id = query.id
    }

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
        },
        {
          model:models.Comentarios,
          order: [['ceatedAt', 'DESC']],
          as:'comentarios',
          include: [
            {
              model: models.User, // Relación con User
              as: 'users', // Alias definido en el modelo Ticket_interesados
              attributes:['id','name','lastName','avatar','role','email'],
              
            }
          ]
        }
        ],

      where, 
      order: [['id', 'DESC']]
    }
    //console.log(models);
    const tickets = await models.Tickets.findAll(options);
    return tickets;
  }

  async findOne(id) {
    const record = await models.Tickets.findByPk(id);
    if (!record) {
      throw boom.notFound('product not found');
    }
    if (record.isBlock) {
      throw boom.conflict('product is block');
    }
    return record;
  }

  async update(id, changes) {
    const model = await this.findOne(id);
    const record = await model.update(changes);
    if (!record) {
      throw boom.notFound('product not found');
    }
    return record;
  }

//   async delete(id) {
//     const product = await this.findOne(id);
//     await product.destroy();
//     return { rta: true };
//   }

}

module.exports = Tickets;
