const faker = require('faker');
const boom = require('@hapi/boom');
const { Op } = require('sequelize');//operadores
const { models } = require('../libs/sequelize');

const { ComentariosSchema } = require('../db/models/comentarios.model');

class Comentarios {
  constructor() {

  }

  async create(data) {
    const newRecord = await models.Comentarios.create(data);
    return newRecord;
  }
}

module.exports = Comentarios;
