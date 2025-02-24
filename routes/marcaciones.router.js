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
const { formatddmmyyyy, getFechaLocalChile, getHoraLocalChile } = require('./../utils/dateUtils.js');
const moment = require("moment-timezone");
const { DateTime } = require('luxon');

router.get('/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const record = await service.find({ fecha: req.query.fecha });
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
      //TODO DEBEMOS OBTENER LA FECHA ZONA HORARIA CHILE
      //const hoy = new Date(); // Fecha actual 
      let  fechaLocal  =  DateTime.now().setZone('America/Santiago');
      fechaLocal = fechaLocal.toFormat('yyyy-MM-dd')

      const record = await service.find({ usuario_id: req.params.id, fecha: fechaLocal }); //await service.findOne(req.params.id);
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

       let fechaLocal  =  getFechaLocalChile();
       let horaLocal = getHoraLocalChile();
      if(req.body.fecha){
        fechaLocal = req.body.fecha;
      }
      if(req.body.hora){
        horaLocal = req.body.hora;
      }

      const record = await service.find({ usuario_id: req.body.usuario_id, tipo: req.body.tipo, fecha: fechaLocal }); //await service.findOne(req.params.id);
      if (record.length > 0) {
        return res.json({ msg: "Existe registro tipo " + req.body.tipo + " para el usuario para la fecha " + fechaLocal });
      }

      //para obener corresondiente a la zona horaria.
      // console.log("FECHA LOCAL",fechaLocal);
      let newRecord = {
        usuario_id: req.body.usuario_id,
        tipo: req.body.tipo,
        fecha: fechaLocal,
        hora: horaLocal, // Hora actual en formato HH:mm:ss
        geolocalizacion: req.body.geolocalizacion,
        observacion: req.body.observacion ?? ''
      };

      let partes = newRecord.geolocalizacion.split(", ");
      // Asignar latitud y longitud a variables separadas
      let latitud = parseFloat(partes[0]);
      let longitud = parseFloat(partes[1]);

      const newrecord = await service.create(newRecord);
      // //cargo el Template para reemplazar las variables.
      const htmlTemplate = await fs.readFile('./notificar-marcacion.html', 'utf8');

      let $tipoNom = newrecord.tipo == 'entrada' ? 'Entrada' : 'Salida';

      // //TODO : debemos notificar con un correo.
      const htmlContent = htmlTemplate
        .replace('{{nombre}}', req.user.name + ' ' + req.user.lastName)
        .replace('{{tipoMarcacion}}', $tipoNom)
        .replace('{{fecha}}', formatddmmyyyy(newrecord.fecha))
        .replace('{{hora}}', newrecord.hora)
        .replace('{{latitud}}', latitud)
        .replace('{{longitud}}', longitud)
      // //enviar el correo
      const mail = {
        from: config.usrEmail, // sender address
        to: req.user.email, // list of receivers
        subject: 'Registro de Marcación - '+ String(newrecord.tipo).toUpperCase(), // Subject line
        html: htmlContent, // html body
      }

      // //ACA ENVIAMOS EL CORREO A AL PERSONA QUE INGRESO LA SOLICITUD
       const r = await serviceAuth.sendMail(mail);
       res.json(newrecord);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/buscar', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    //const requiredTypes = ["entrada", "salida_almuerzo", "entrada_almuerzo", "salida"];

    const year = req.body.year;
    const month = req.body.month;
    const startDate  = req.body.fechaInicio; //deberia llegar en formato AAAAMMDD
    const endDate  = req.body.fechaTermino;
    //console.log("BODY",req.body);
    // const validatedMonth = month;
    // const timezone = "America/Santiago";
    // const startDate = moment.tz(`${year}-${validatedMonth}-01 08:00:00`, timezone);
    // const lastDayOfMonth = moment.tz(`${year}-${validatedMonth}-01`, timezone).endOf('month').date();
    // const endDate = moment.tz(`${year}-${validatedMonth}-${lastDayOfMonth} 08:00:00`, timezone);

    const between = {
      startDate,
      endDate,
    }

    let centro_id = req.body.centro_id ?? null;
    ///console.table(req.body.centro_id);

    const records = await service.find({
      between,
      usuario_id: req.body.usuario_id,
      centro_id
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

    // Completar marcaciones faltantes ANTES ERAN LAS $ AHORA SE DEJA SOLO ENTRADA Y SALIDA
    Object.keys(grouped).forEach((date) => {
      Object.keys(grouped[date]).forEach((userId) => {
        const marcaciones = grouped[date][userId].marcaciones;

        // Crear un mapa por tipo de marcación
        const marcacionesByType = marcaciones.reduce((map, marcacion) => {
          if (["entrada", "salida"].includes(marcacion.tipo)) {
            map[marcacion.tipo] = marcacion;
          }
          return map;
        }, {});

          // Tipos requeridos (solo entrada y salida)
        const requiredTypes = ["entrada", "salida"];
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

router.patch('/:id',
  passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
      try {
        const { id } = req.params;
        const body = req.body;
        const newrecord = await service.update(id, body);
        res.json(newrecord);
      } catch (error) {
        next(error);
      }
    }
  );


module.exports = router;
