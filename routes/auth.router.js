const express = require('express');
const { config } = require('./../config/config'); ///tengo la config para tener secret
const passport = require('passport');
const router = express.Router();
const AuthService = require('./../services/auth.services');
const service = new AuthService();
const bcrypt = require('bcrypt');
validatorHandler = require('../middlewares/validator.handler');
const { checkCookie } = require('../middlewares/auth.handler');//validar la cookie de la peticion.

const {loginAuthSchema,  recoveryAuthSchema,  changePasswordAuthSchema} = require('../schemas/auth.schema');


router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  async (req, res, next) => {
    try {
      res.json(service.signToken(req.user)); //el usuer que entrega el middelware de passport
    } catch (error) {
      next(error);
    }
  }
);

router.post('/recovery', async (req, res, next) => {
  try {
    const { email } = req.body;
    const rta = await service.sendRecovery(email);
    res.json(rta)
  } catch (error) {
    next(error);
  }
});

router.post(
  '/change-password',
  validatorHandler(changePasswordAuthSchema, 'body'),
  async (req, res, next) => {
    try {
      const { token, newPassword, usaRecovery } = req.body;
      const rta = await service.changePassword(token, newPassword,usaRecovery);
      res.json(rta);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/logout', async (req, res, next) => {
  try {
    res.clearCookie('authToken');
    res.json({ message: "Logout exitoso" });
  } catch (error) {
    next(error);
  }
});



router.get('/user', async (req, res, next) => {
  try {
    const user = req.cookies?.authToken;
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/login2",
  passport.authenticate("local", { session: false }),
  async (req, res, next) => {
    try {

      console.log(req);

      const token = service.signToken(req.user);

      res.cookie("authToken", token, {
        httpOnly: true,  // Evita acceso desde JavaScript
        secure: true, // Solo en HTTPS en producción
        sameSite: "None", // Protección contra ataques CSRF//Strict para pruebas
        maxAge: 24 * 60 * 60 * 1000, // 1 día
      });

      res.json({ message: "Login exitoso" });
    } catch (error) {
      next(error);
    }
  }
);

//*estafunciones solo de prueba para validar la cookie/
router.get('/testCookie',checkCookie, async (req, res, next) => {
  try {
  
    const cookie = req.cookies.authToken;
    const token = cookie.token;

    if (!token) {
      return res.status(401).json({ message: 'No se proporcionó un token de autenticación.' });
    }

    const decodedToken = await service.verifyToken(token);
    console.log('decodedToken',decodedToken);
    if (!decodedToken) {
      return res.status(401).json({ message: 'No se proporcionó un token de autenticación.' });
    }

   console.log(cookie);

    res.json({ message: 'Token de autenticación válido.',
      'decodedToken':decodedToken,
      'cookie':cookie
     });



  } catch (error) {
    next(error);
  }
});

module.exports = router;