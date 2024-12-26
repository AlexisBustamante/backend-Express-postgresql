const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const { models } = require('./../libs/sequelize');
const { Op } = require('sequelize');

class UserService {
  constructor() { }

  async create(data) {
    const hash = await bcrypt.hash(data.password, 10);
    const newUser = await models.User.create({
      ...data,
      password: hash
    });
    delete newUser.dataValues.password;
    return newUser;
  }

  async find(id) {
    const queryOptions = {
      include: ['customer'],
      order: [[orderBy, 'ASC']],//Ordena por defecto por ID en orden ascendente
    };
  
    // Si se pasa un ID, excluye el registro con ese ID
    if (id) {
      queryOptions.where = {
        id: {
          [Op.ne]: id, // Excluye el registro con el ID proporcionado
        },
      };
    }
  
    const rta = await models.User.findAll(queryOptions);
    return rta;
  }

  async findOne(id) {
    const user = await models.User.findByPk(id);
    if (!user) {
      throw boom.notFound('user not found');
    }
    return user;
  }

  async update(id, changes) {
    const user = await this.findOne(id);
    const rta = await user.update(changes);
    return rta;
  }

  async delete(id) {
    const user = await this.findOne(id);
    await user.destroy();
    return { id };
  }

  async findByEmail(email) {
    const rta = await models.User.findOne({
      where: { email }
    });
    return rta;
  }
}

module.exports = UserService;
