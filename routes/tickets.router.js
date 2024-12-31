const express = require('express');
const passport = require('passport');
const validatorHandler = require('./../middlewares/validator.handler');
const {checkRoles}= require('./../middlewares/auth.handler');
const router = express.Router();

 const Ticket_Interesados = require('./../services/ticket_interesados.service');
 const serviceInteresados = new Ticket_Interesados();

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

router.post('/', 
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
  //   validatorHandler(queryProductSchema, 'query');
    try {

      const body = req.body;
      //crear el ticket
      //const tickets = await service.create(body);
      //console.log(body.ticket_insteresados);
      //crear los interesados
      const interesados = await serviceInteresados.create(body.ticket_insteresados,10);
      //crear el primer comentario.
      //res.json(tickets);
      res.json({msg:"save record"});

    } catch (error) {
      next(error);
    }
  });
  

module.exports = router;
