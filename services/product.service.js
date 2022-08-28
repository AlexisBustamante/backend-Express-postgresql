const faker = require('faker');
const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class ProductsService {

  constructor() {

  }


  async create(data) {
    const newProduct = await models.Product.create(data);
    return newProduct;
  }

  async find() {
    const products = await models.Product.findAll({
      include: ['category']
    });
    return products;
  }

  async findOne(id) {
    const product = await models.Products.findByPk(id);
    if (!product) {
      throw boom.notFound('product not found');
    }
    if (product.isBlock) {
      throw boom.conflict('product is block');
    }
    return product;
  }

  async update(id, changes) {
    const model = await this.findOne(id);
    const product = await model.update(changes);
    if (!product) {
      throw boom.notFound('product not found');
    }
    return product;
  }

  async delete(id) {
    const product = await this.findOne(id);
    await product.destroy();
    return { rta: true };
  }

}

module.exports = ProductsService;
