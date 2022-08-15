const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');
//uso de una coneccion con Client de PG
class UserService {
  constructor() {

  }
  async create(data) {
    const newUser = await models.User.create(data);
    return newUser;
  }

  async find() {
    const client = await models.User.findAll();
    return client;
  }

  async findOne(id) {
    const user = await models.User.findByPk(id);
    if (!user) {
      throw boom.notFound("user not found");//se envia el error
    }
    return user;
  }

  async update(id, changes) {
    const user = await this.findOne(id);
    const res = await user.update(changes);
    return res;
  }

  async delete(id) {
    const user = await this.findOne(id);
    await user.destroy();
    return { id };
  }
}

module.exports = UserService;
