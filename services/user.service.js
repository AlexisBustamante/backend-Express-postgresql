const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const { models } = require('./../libs/sequelize');
const { Op } = require('sequelize');
const { Sequelize, DataTypes } = require('sequelize');

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

  async find(filter) {
    const queryOptions = {
      include: ['customer','cargos','centros'],
      order: [['createdAt', 'DESC']],//Ordena por defecto por ID en orden ascendente
      attributes: {
        exclude: ['password'],//excluyo el campo password
      },
    };

    let where = {};//aca podemos ir agregando los filtros que necesitemos
    if (filter && filter.estado != null) {
      where.estado = filter.estado
    }
    if (filter && filter.id != null) {//el id se pasa para excluir.
      where.id = {[Op.ne]: filter.id};
    }
    queryOptions.where = where
    // Si se pasa un ID, excluye el registro con ese ID
  
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
    //en vez de eliminar desactivamos a los usuarios.
    let user = await this.findOne(id);
    let estadoNew = user.estado == 1 ? 0 : 1;
    const rta = await user.update({ estado:estadoNew });
    return rta;
  }

  async findByEmail(email) {
    const rta = await models.User.findOne({
      include: ['customer','cargos','centros'],
      where: { email }
    });
    return rta;
  }
}

module.exports = UserService;
