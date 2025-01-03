const express = require('express');
const passport = require('passport');
const validatorHandler = require('./../middlewares/validator.handler');
const {checkRoles}= require('./../middlewares/auth.handler');
const router = express.Router();

const Comentarios = require('./../services/comentarios.service');
const serviceComentarios = new Comentarios();

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

router.get('/detalle/:id', 
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
  //   validatorHandler(queryProductSchema, 'query');
    try {
      const tickets = await service.find({ id : req.params.id });
      res.json(tickets);
    } catch (error) {
      next(error);
    }
  });


//tickets del usuario.
router.get('/user/:id', 
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
  //   validatorHandler(queryProductSchema, 'query');
    try {
      //req.user existe en la peticion :)
      //console.log(req.params.id);
      const tickets = await service.find({ usuario_id : req.params.id });
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
      let body = req.body;
      //crear el ticket
       const tickets = await service.create(body);
       const interesados = await serviceInteresados.create(body.ticket_insteresados,tickets.id);

      res.json({msg:"save records"});
    } catch (error) {
      next(error);
    }
  });

  router.post('/comentario', 
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
    //   validatorHandler(queryProductSchema, 'query');
    //guardar el comentario del ticket.
      try {
        let body = req.body;
         //crear el ticket
         const comentario = await serviceComentarios.create(body);
         //aca creamos el comentario.
          res.json({msg:"save records",comentario});
      } catch (error) {
        next(error);
      }
    });
module.exports = router;
