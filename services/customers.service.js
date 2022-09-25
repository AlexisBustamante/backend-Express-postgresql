const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');
const bcrypt = require('bcrypt');

class CustomerService {

  constructor() { }

  async find() {
    const rta = await models.Customer.findAll({
      include: ['user']
    });
    return rta;
  }

  async findOne(id) {
    const user = await models.Customer.findByPk(id);
    if (!user) {
      throw boom.notFound('customer not found');
    }
    return user;
  }
  async create(data) {
    //con la asociacion entre customer y user, se puede crear en el mismo end point
    //los registros relacionados siempre y cunaod vnega dentro de data el subojeto "user"
    //ya que de esta manera se llama la relación

    const hash = await bcrypt.hash(data.user.password, 10);

    const newData = {
      ...data,
      user: {
        ...data.user,
        password: hash
      }
    }

    const newCustomer = await models.Customer.create(newData, {
      include: ['user']
    });

    delete newCustomer.user.dataValues.password;
    return newCustomer;
  }

  async update(id, changes) {
    const model = await this.findOne(id);
    const rta = await model.update(changes);
    return rta;
  }

  async delete(id) {
    const model = await this.findOne(id);
    await model.destroy();
    return { rta: true };
  }

}

module.exports = CustomerService;
