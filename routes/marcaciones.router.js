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
const moment = require("moment-timezone");

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

router.get('/user/:id',
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

router.post('/buscar', passport.authenticate('jwt', { session: false }),async (req, res, next) => {
    try {
      const requiredTypes = ["entrada", "salida_almuerzo", "entrada_almuerzo", "salida"];

      const year = req.body.year;
      const month = req.body.month;
      const validatedMonth = month;

      const timezone = "America/Santiago";

      const startDate = moment.tz(`${year}-${validatedMonth}-01 00:00:00`, timezone);
      const lastDayOfMonth = moment.tz(`${year}-${validatedMonth}-01`, timezone).endOf('month').date();
      const endDate  = moment.tz(`${year}-${validatedMonth}-${lastDayOfMonth} 00:00:00`, timezone);

      const between = {
        startDate,
        endDate,
      }

      const records = await service.find({
        between,
        usuario_id: req.body.usuario_id,
      });

      //aca agrupamos los registros pr fecha.
      // Agrupar por fecha y usuario
      const grouped = records.reduce((acc, record) => {
        const date = record.fecha;
        const userId = record.usuario_id;

        if (!acc[date]) acc[date] = {};
        if (!acc[date][userId]) {
          acc[date][userId] = {
            usuario: record.users,
            marcaciones: [],
          };
        }
        acc[date][userId].marcaciones.push(record);
        return acc;
      }, {});

      // Completar marcaciones faltantes
      Object.keys(grouped).forEach((date) => {
        Object.keys(grouped[date]).forEach((userId) => {
          const marcaciones = grouped[date][userId].marcaciones;

          // Crear un mapa por tipo de marcación
          const marcacionesByType = marcaciones.reduce((map, marcacion) => {
            map[marcacion.tipo] = marcacion;
            return map;
          }, {});

          // Completar tipos faltantes
          const completedMarcaciones = requiredTypes.map((tipo) => {
            return (
              marcacionesByType[tipo] || {
                id: null,
                fecha: date,
                hora: null,
                tipo,
                geolocalizacion: null,
                usuario_id: parseInt(userId),
                users: grouped[date][userId].usuario,
              }
            );
          });

          grouped[date][userId].marcaciones = completedMarcaciones;
        });
      });

    res.json(grouped);
    } catch (error) {
      next(error);
    }
  }
);


router.get('/dashboard',
  passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
      try {
        let result = {};
        result.totales = await service.getForDashboard();        
        res.json(result);
      } catch (error) {
        next(error);
      }
    }
  );




module.exports = router;
