const express = require('express');
const passport = require('passport');
const validatorHandler = require('./../middlewares/validator.handler');
const {checkRoles}= require('./../middlewares/auth.handler');
const router = express.Router();
const Tickets = require('./../services/tickets.services');
const service = new Tickets();

router.get('/', 
passport.authenticate('jwt', { session: false }),
async (req, res, next) => {
//   validatorHandler(queryProductSchema, 'query');
  try {
    const tickets = await service.find();
    res.json(tickets);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
