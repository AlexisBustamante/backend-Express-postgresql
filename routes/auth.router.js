const express = require('express');
const { config } = require('./../config/config'); ///tengo la config para tener secret
const passport = require('passport');
const router = express.Router();
const AuthService = require('./../services/auth.services');
const service = new AuthService();
const bcrypt = require('bcrypt');
validatorHandler = require('../middlewares/validator.handler');
const {loginAuthSchema,  recoveryAuthSchema,  changePasswordAuthSchema} = require('../schemas/auth.schema');

//passport se utiliza como un middlewares

router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  async (req, res, next) => {
    try {
      res.json(service.signToken(req.user)); //el usuer que entrega el middelware de passport
    } catch (error) {
      next(error);
    }
  }
);

router.post('/recovery', async (req, res, next) => {
  try {
    const { email } = req.body;
    const rta = await service.sendRecovery(email);
    res.json(rta)
  } catch (error) {
    next(error);
  }
});

router.post(
  '/change-password',
  validatorHandler(changePasswordAuthSchema, 'body'),
  async (req, res, next) => {
    try {
      const { token, newPassword } = req.body;
      const rta = await service.changePassword(token, newPassword);
      res.json(rta);
    } catch (error) {
      next(error);
    }
  }
);
module.exports = router;