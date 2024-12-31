const faker = require('faker');
const boom = require('@hapi/boom');
const { Op } = require('sequelize');//operadores
const { models } = require('../libs/sequelize');

const { TicketsSchema } = require('../db/models/tickets.model');

class Tickets {
  constructor() {

  }

  async create(ticket_insteresados,ticket_id) {

    let interesadosReturn = [];
    for (let interesado of ticket_insteresados) {

        let recordfind = {ticket_id,usuario_id:interesado.usuario_id};
        let tk_int = await this.findOne(recordfind);
        console.log(tk_int);
        if(!tk_int){
            const newRecord = await models.Ticket_interesados.save(recordfind);
            interesadosReturn.push(newRecord);
            console.log('se crea ',newRecord);
        }else{
            console.log('ya existe, nose crea nada.');
        }
        //buscamos si existe.
    }
    //const ticket = await models.Tickets.create(newrecord);
    //return ticket;
  }





  async findOne(data) {
    const options = {
        where: { 
            usuario_id:data.usuario_id,
            ticket_id:data.ticket_id,
         }, // Buscar por ID
        attributes: ['usuario_id'],
      };

    const tk_interesado = await models.Ticket_interesados.findAll(options);
    if (!tk_interesado) {
      throw boom.notFound('tk_interesado not found');
    }
    if (tk_interesado.isBlock) {
      throw boom.conflict('tk_interesado is block');
    }
    return tk_interesado[0];
  }

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
