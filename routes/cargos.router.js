const express = require('express');
const passport = require('passport');
const CargosServices = require('../services/cargos.services');
const {checkRoles} = require('./../middlewares/auth.handler');

const router = express.Router();
const service = new CargosServices();
const fs = require('fs').promises;
const AuthService = require('./../services/auth.services');
const { config } = require('./../config/config'); ///tengo la config para tener secret

router.get('/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const record = await service.findAllRecords();
      res.json(record);
    } catch (error) {
      next(error);
    }
  }
);

//para crear cargo.
router.post('/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const newRecord = req.body;
        newrecord = await service.create(newRecord);
      res.json(newrecord);
    } catch (error) {
      next(error);
    }
  }
);

//para eliminar cargo.
router.delete('/:id',
    passport.authenticate('jwt', { session: false }), 
    checkRoles('admin'),
    async (req, res, next) => {
      try {
        const { id } = req.params;
        await service.delete(id);
        res.status(201).json({id});
      } catch (error) {
        next(error);
      }
    }
  );


  router.patch('/:id',
    passport.authenticate('jwt', { session: false }),
      async (req, res, next) => {
        try {
          const { id } = req.params;
          const body = req.body;
          const record = await service.update(id, body);
          res.json(record);
        } catch (error) {
          next(error);
        }
      }
    );

module.exports = router;
