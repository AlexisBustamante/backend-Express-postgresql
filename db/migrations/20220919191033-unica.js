'use strict';


const { UserSchema, USER_TABLE } = require('./../models/userModel');
const { CustomerSchema, CUSTOMER_TABLE } = require('./../models/customerModel');
const { ProductSchema, PRODUCT_TABLE } = require('./../models/productModel');
const { CategorySchema, CATEGORY_TABLE } = require('./../models/categoryModel');
const { OrderSchema, ORDER_TABLE } = require('./../models/orderModel');
const { OrderProductSchema, ORDER_PRODUCT_TABLE } = require('./../models/order-productModel');

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(USER_TABLE, UserSchema);
    await queryInterface.createTable(CUSTOMER_TABLE, CustomerSchema);
    await queryInterface.createTable(PRODUCT_TABLE, ProductSchema);
    await queryInterface.createTable(CATEGORY_TABLE, CategorySchema);
    await queryInterface.createTable(ORDER_TABLE, OrderSchema);
    await queryInterface.createTable(ORDER_PRODUCT_TABLE, OrderProductSchema);
  },

  async down(queryInterface) {
    await queryInterface.dropTable(USER_TABLE);
    await queryInterface.dropTable(CUSTOMER_TABLE);
    await queryInterface.dropTable(PRODUCT_TABLE);
    await queryInterface.dropTable(CATEGORY_TABLE);
    await queryInterface.dropTable(ORDER_TABLE);
    await queryInterface.dropTable(ORDER_PRODUCT_TABLE);
  }
};