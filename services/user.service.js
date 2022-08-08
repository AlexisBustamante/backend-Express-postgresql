const boom = require('@hapi/boom');
const pool = require('../libs/postgres.pool');
//uso de una coneccion con Client de PG

class UserService {
  constructor() {
    this.pool = pool;
    this.pool.on('error', (err) => console.error(err));//aca  //se deja escuchando
  }
  async create(data) {
    return data;
  }

  async find() {
    const query = 'select * from tasks';
    const res = await this.pool.query(query);
    return res.rows;
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

module.exports = UserService;
