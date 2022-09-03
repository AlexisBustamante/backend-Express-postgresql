const faker = require('faker');
const boom = require('@hapi/boom');
const { Op } = require('sequelize');//operadores
const { models } = require('../libs/sequelize');

class ProductsService {

  constructor() {

  }


  async create(data) {
    const newProduct = await models.Product.create(data);
    return newProduct;
  }

  async find(query) {
    const options = {
      include: ['category'],
      where: {}
    }

    const { limit, offset, price, price_min, price_max } = query;
    ///paginacion opcional
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }
    //filtrar por 1 precio especifico
    if (price) {
      options.where.price = price;
    }

    if (price_min && price_max) {

      options.where.price = {
        [Op.gte]: price_min,//mayor o igual al precio min
        [Op.lte]: price_max,//Menor o igual al precio maximo
      }

    }

    //hago consulta a la BD
    const products = await models.Product.findAll(options);
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
