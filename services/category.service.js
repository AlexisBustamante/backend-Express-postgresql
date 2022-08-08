const boom = require('@hapi/boom');
const pool = require('../libs/postgres.pool');

class CategoryService {

  constructor() {
    this.pool = pool;
    this.pool.on('error', (err) => console.error(err));//aca  //se deja escuchando algun error que pueda existir en la conx del Pool
  }
  async create(data) {
    return data;
  }

  async find() {
    return [];
  }

  async findOne(id) {
    return { id };
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

module.exports = CategoryService;
