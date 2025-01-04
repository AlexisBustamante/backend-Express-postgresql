const express = require('express');
const passport = require('passport');
const MarcacionesServices = require('../services/marcaciones.services');
const router = express.Router();
const service = new MarcacionesServices();


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

router.get('/:id',
    passport.authenticate('jwt', { session: false }),
      async (req, res, next) => {
        try {
          const record = await service.find({ usuario_id: req.params.id }); //await service.findOne(req.params.id);
          res.json(record);
        } catch (error) {
          next(error);
        }
      }
    );

router.post('/',
passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {

            const hoy = new Date(); // Fecha actual
            const record = await service.find({ usuario_id: req.body.usuario_id , tipo:req.body.tipo,fecha:hoy }); //await service.findOne(req.params.id);
        if(record.length > 0){
            return res.json({msg:"Existe registro tipo "+req.body.tipo+" para el usuario para la fecha "+hoy});
        }

        //para obener corresondiente a la zona horaria.
        const ahora = new Date();
        const horaLocal = ahora.toLocaleTimeString('es-ES', { hour12: false }); // Hora local en formato 24h
        console.log(horaLocal); // Ejemplo: 10:52:24

        let newRecord = {
            usuario_id : req.body.usuario_id,
            tipo : req.body.tipo,
            fecha : hoy,
            hora: horaLocal, // Hora actual en formato HH:mm:ss
        };
        
        const newrecord = await service.create(newRecord);

        //SI NO EXISTE EL REGISTRO SE DEBE CREAR.
         //const record = await service.create(req.body);

         res.json(newrecord);
    } catch (error) {
      next(error);
    }
  }
);








module.exports = router;
