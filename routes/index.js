const express = require('express');
const profileRouter = require('./profile.router');

const productsRouter = require('./products.router');
const categoriesRouter = require('./categories.router');
const usersRouter = require('./users.router');
const orderRouter = require('./orders.router');
const customersRouter = require('./customers.router');
const authRouter = require('./auth.router');
const incidenciasRouter = require('./incidencias.router');
const ticketsRouter = require('./tickets.router');
const marcacionesRouter = require('./marcaciones.router');
const cargos = require('./cargos.router');
const centros = require('./centros.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/products', productsRouter);
  router.use('/categories', categoriesRouter);
  router.use('/users', usersRouter);
  router.use('/orders', orderRouter);
  router.use('/customers', customersRouter);
  router.use('/auth', authRouter);
  router.use('/profile', profileRouter);
  router.use('/incidencias', incidenciasRouter);
  router.use('/tickets', ticketsRouter);
  router.use('/marcaciones', marcacionesRouter);
  router.use('/cargos', cargos);
  router.use('/centros', centros);
}

module.exports = routerApi;
