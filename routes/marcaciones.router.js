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

router.post('/editar',
  passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
      try {
        const { id } = req.body;
        const body = req.body;
        const newrecord = await service.update(id, body);
        res.json(newrecord);
      } catch (error) {
        next(error);
      }
    }
  );

  router.post('/buscar-resumen', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
      //const requiredTypes = ["entrada", "salida_almuerzo", "entrada_almuerzo", "salida"];
  
      // const year = req.body.year;
      // const month = req.body.month;
      const startDate  = req.body.fechaInicio; //deberia llegar en formato AAAAMMDD
      const endDate  = req.body.fechaTermino;
      //console.log("BODY",req.body);
      // const validatedMonth = month;
      // const timezone = "America/Santiago";
      // const startDate = moment.tz(`${year}-${validatedMonth}-01 08:00:00`, timezone);
      // const lastDayOfMonth = moment.tz(`${year}-${validatedMonth}-01`, timezone).endOf('month').date();
      // const endDate = moment.tz(`${year}-${validatedMonth}-${lastDayOfMonth} 08:00:00`, timezone);
      let obBusqueda = {};


      if(req.body.centro_id){
        obBusqueda.centro_id = req.body.centro_id;
      }

      if(req.body.centro_id ){
        obBusqueda.centro_id = req.body.centro_id;
      }

      if(req.body.usuario_id ){
        obBusqueda.usuario_id = req.body.usuario_id;
      }

      const between = {
        startDate,
        endDate,
      }
      obBusqueda.between = between;
      ///console.table(req.body.centro_id);
  
      const records = await service.find(obBusqueda);
  
      const grouped = records.reduce((acc, record) => {
        const userId = record.usuario_id;
        const date = record.fecha;
    
        if (!acc[userId]) {
            acc[userId] = {
                usuario: record.users,
                fechas: {},
                totalDiasContemplados: 0, // Cantidad de días con marcaciones
                totalHorasRestadas: 0, // Total de horas descontadas (1h por día trabajado)
                totalHorasBrutas: 0, // Total sin restar
                totalHorasBrutasFormato: "00:00:00",
                totalHorasAjustadas: 0, // Total con ajuste
                totalHorasAjustadasFormato: "00:00:00"
            };
        }
    
        if (!acc[userId].fechas[date]) {
            acc[userId].fechas[date] = {
                marcaciones: [],
                horasTrabajadasBrutas: 0,
                horasTrabajadasBrutasFormato: "00:00:00",
                horasTrabajadasAjustadas: 0,
                horasTrabajadasAjustadasFormato: "00:00:00"
            };
        }
    
        acc[userId].fechas[date].marcaciones.push(record);
        return acc;
    }, {});
    
    // Función para formatear segundos a HH:MM:SS
    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };
    
    // Calcular las horas y días trabajados
    Object.keys(grouped).forEach((userId) => {
        let totalSegundosBrutosUsuario = 0;
        let totalSegundosAjustadosUsuario = 0;
        let totalDiasContemplados = 0;
    
        Object.keys(grouped[userId].fechas).forEach((date) => {
            const marcaciones = grouped[userId].fechas[date].marcaciones;
    
            const marcacionesByType = marcaciones.reduce((map, marcacion) => {
                if (["entrada", "salida"].includes(marcacion.tipo)) {
                    map[marcacion.tipo] = marcacion;
                }
                return map;
            }, {});
    
            const requiredTypes = ["entrada", "salida"];
            const completedMarcaciones = requiredTypes.map((tipo) => (
                marcacionesByType[tipo] || {
                    id: null,
                    fecha: date,
                    hora: null,
                    tipo,
                    geolocalizacion: null,
                    usuario_id: parseInt(userId),
                    users: grouped[userId].usuario,
                }
            ));
    
            grouped[userId].fechas[date].marcaciones = completedMarcaciones;
    
            let segundosTrabajadosBrutos = 0;
            let segundosTrabajadosAjustados = 0;
    
            if (marcacionesByType["entrada"] && marcacionesByType["salida"]) {
                const entradaHora = marcacionesByType["entrada"].hora;
                const salidaHora = marcacionesByType["salida"].hora;
    
                if (entradaHora && salidaHora) {
                    const [h1, m1, s1] = entradaHora.split(":").map(Number);
                    const [h2, m2, s2] = salidaHora.split(":").map(Number);
    
                    const entradaSegundos = h1 * 3600 + m1 * 60 + s1;
                    const salidaSegundos = h2 * 3600 + m2 * 60 + s2;
    
                    segundosTrabajadosBrutos = salidaSegundos - entradaSegundos;
                    segundosTrabajadosAjustados = segundosTrabajadosBrutos - 3600;
                    if (segundosTrabajadosAjustados < 0) segundosTrabajadosAjustados = 0;
                }
            }
    
            grouped[userId].fechas[date].horasTrabajadasBrutas = segundosTrabajadosBrutos / 3600;
            grouped[userId].fechas[date].horasTrabajadasBrutasFormato = formatTime(segundosTrabajadosBrutos);
    
            grouped[userId].fechas[date].horasTrabajadasAjustadas = segundosTrabajadosAjustados / 3600;
            grouped[userId].fechas[date].horasTrabajadasAjustadasFormato = formatTime(segundosTrabajadosAjustados);
    
            totalSegundosBrutosUsuario += segundosTrabajadosBrutos;
            totalSegundosAjustadosUsuario += segundosTrabajadosAjustados;
            totalDiasContemplados++;
        });
    
        grouped[userId].totalHorasBrutas = totalSegundosBrutosUsuario / 3600;
        grouped[userId].totalHorasBrutasFormato = formatTime(totalSegundosBrutosUsuario);
    
        grouped[userId].totalHorasAjustadas = totalSegundosAjustadosUsuario / 3600;
        grouped[userId].totalHorasAjustadasFormato = formatTime(totalSegundosAjustadosUsuario);
    
        grouped[userId].totalDiasContemplados = totalDiasContemplados;
        grouped[userId].totalHorasRestadas = totalDiasContemplados; // 1 hora por cada día trabajado
    });
    
    // 🔥 Ahora grouped[userId] tendrá totalHorasRestadas y totalDiasContemplados

      
      res.json(grouped);
    } catch (error) {
      next(error);
    }
  }
  );


  router.post('/crear-x-usuario',
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
      try {
        //esta funciona es para crear la marcacion entrada por usuario.
        if(req.body.fecha){
          fechaLocal = req.body.fecha;
        }
        if(req.body.hora){
          horaLocal = req.body.hora;
        }
  
        const record = await service.find({ usuario_id: req.body.usuario_id, tipo: req.body.tipo, fecha: fechaLocal }); //await service.findOne(req.params.id);
        if (record.length > 0) {
          return res.json({ success: false, msg: "Existe registro tipo " + req.body.tipo + " para el usuario para la fecha " + fechaLocal });
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
        // Asignar latitud y longitud a variables separadas
        const newrecord = await service.create(newRecord);
         res.json(newrecord);
      } catch (error) {
        next(error);
      }
    }
  );

module.exports = router;
