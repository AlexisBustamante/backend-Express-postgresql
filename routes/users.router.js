const express = require('express');

const UserService = require('./../services/user.service');
const validatorHandler = require('./../middlewares/validator.handler');
const { updateUserSchema, createUserSchema, getUserSchema } = require('./../schemas/user.schema');

const router = express.Router();
const service = new UserService();
const fs = require('fs').promises;
const AuthService = require('./../services/auth.services');
const serviceAuth = new AuthService();
const { config } = require('./../config/config'); ///tengo la config para tener secret

router.get('/all/:id', async (req, res, next) => {
  try {
    //console.log(req.params);
    //{id:req.params.id}
    const users = await service.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const users = await service.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/activos', async (req, res, next) => {
  try {
    const users = await service.find( { estado: 0 } );
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/:id',
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await service.findOne(id);
      res.json(category);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  validatorHandler(createUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const findByEmail = await service.findByEmail(req.body.email);
      if (findByEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      const body = req.body;
      const newUser = await service.create(body);
      
      // si el usuario es creado se enviara un correo con sus credenciales.

      // enviar correo
      const htmlTemplate = await fs.readFile('./notificar-createUser.html', 'utf8');
      const htmlContent = htmlTemplate
      .replace('{{nombre}}', req.body.name +' '+ req.body.lastName)
      .replace('{{usuario}}', req.body.email)
      .replace('{{password}}', req.body.password)
    //enviar el correo
    const mail = {
      from: config.usrEmail, // sender address
      to: req.body.email, // list of receivers
      subject: 'Credenciales de acceso', // Subject line
      html: htmlContent, // html body
    }

      //ACA ENVIAMOS EL CORREO A AL PERSONA QUE INGRESO LA SOLICITUD
      const r = await serviceAuth.sendMail(mail);
      // console.log("RESPUESTA",r);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/editar',
  async (req, res, next) => {
    try {
      const { id } = req.body;
      const body = req.body;
      const newUser = await service.update(id, body);
      res.json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  validatorHandler(getUserSchema, 'params'),
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

module.exports = router;

