const express = require('express');
const router = express.Router();
const IncidenciasServices = require('./../services/incidencias.services');
const service = new IncidenciasServices();
const nodemailer = require('nodemailer');
const { config } = require('./../config/config'); ///tengo la config para tener secret
const fs = require('fs').promises;
const AuthService = require('./../services/auth.services');
const serviceAuth = new AuthService();

router.post('/', async (req, res, next) => {
    try {
      //cargo el Template para reemplazar las variables.
      const htmlTemplate = await fs.readFile('./solicitud-recibida.html', 'utf8');

      // Procesar datos del formulario público
        const data = req.body;
        //console.log(data);
        //TODO: debemos guardar los datos.
        const newIncidencia = await service.create({
          nombre:data.nombre,
          apellidos:data.apellidos,
          tipo_evento:data.tipo_evento,
          email:data.email,
          mensaje:data.mensaje,
        });

        //TODO: debemos cargar el TEMPLATE del correo para enviarlo.
        const htmlContent = htmlTemplate
        .replace('{{solicitudId}}', newIncidencia.id)
        .replace('{{nombre}}', data.nombre)
        .replace('{{apellidos}}', data.apellidos)
        .replace('{{email}}', data.email)
        .replace('{{tipoEvento}}', data.tipo_evento)
        .replace('{{mensaje}}', data.mensaje);

        //TODO: debemos ahora enviar el correo de la persona con el numero de solicitud.
        const mail = {
          from: config.usrEmail, // sender address
          to: data.email, // list of receivers
          subject: 'Confirmación de Incidencia', // Subject line
          html: htmlContent, // html body
        }

        //ACA ENVIAMOS EL CORREO A AL PERSONA QUE INGRESO LA SOLICITUD
          const r = await serviceAuth.sendMail(mail);
        
      // Lógica para manejar la solicitud
      //const result = await service.create(data);
      //aca respondemos al front
      res.status(201).json({msg:'Solicitud Ingresada.'});
    } catch (error) {
      next(error);
    }
  });

  module.exports = router;
