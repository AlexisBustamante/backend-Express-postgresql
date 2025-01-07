const express = require('express');
const passport = require('passport');
const MarcacionesServices = require('../services/marcaciones.services');
const router = express.Router();
const service = new MarcacionesServices();
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const AuthService = require('./../services/auth.services');
const serviceAuth = new AuthService();
const { config } = require('./../config/config'); ///tengo la config para tener secret
const { formatDate } = require('./../utils/dateUtils.js');

router.get('/',
passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const record = await service.find({fecha: req.query.fecha});
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
          const hoy = new Date(); // Fecha actual
          const record = await service.find({ usuario_id: req.params.id,fecha : hoy }); //await service.findOne(req.params.id);
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

        //cargo el Template para reemplazar las variables.
        const htmlTemplate = await fs.readFile('./notificar-marcacion.html', 'utf8');
        //TODO : debemos notificar con un correo.
        const htmlContent = htmlTemplate
        .replace('{{nombre}}', req.user.name+' '+req.user.lastName)
        .replace('{{tipoMarcacion}}', newrecord.tipo)
        .replace('{{fecha}}',formatDate(newrecord.fecha))
        .replace('{{hora}}', newrecord.hora)

        //enviar el correo
        const mail = {
          from: config.usrEmail, // sender address
          to: req.user.email, // list of receivers
          subject: 'Registro de Marcación', // Subject line
          html: htmlContent, // html body
        }

        //ACA ENVIAMOS EL CORREO A AL PERSONA QUE INGRESO LA SOLICITUD
         const r = await serviceAuth.sendMail(mail);
         res.json(newrecord);
    } catch (error) {
      next(error);
    }
  }
);








module.exports = router;
