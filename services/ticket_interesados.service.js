const faker = require('faker');
const boom = require('@hapi/boom');
const { Op } = require('sequelize');//operadores
const { models } = require('../libs/sequelize');

const { TicketsSchema } = require('../db/models/tickets.model');

class Ticket_interesados {
  constructor() {

  }

  async create(ticket_insteresados,ticket_id) {
    let interesadosReturn = [];
    for (let interesado of ticket_insteresados) {
        let recordfind = {ticket_id,usuario_id:interesado.id};
        let tk_int = await this.findOne(recordfind);
        if(!tk_int){
            const newRecord = await models.Ticket_interesados.create(recordfind);
            interesadosReturn.push(newRecord);
        }else{
        }
        //buscamos si existe.
    }
    return interesadosReturn;
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

  async update(id, changes) {
    const model = await this.findOne(id);
    const record = await model.update(changes);
    if (!record) {
      throw boom.notFound('product not found');
    }
    return record;
  }

  async delete(id) {
    const record = await this.findOne(id);
    await record.destroy();
    return { rta: true };
  }

}

module.exports = Ticket_interesados;
