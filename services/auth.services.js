const UserService = require('./user.service');
const service = new UserService();
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { config } = require('./../config/config'); ///tengo la config para tener secret
const nodemailer = require('nodemailer');

class AuthService {
  async getUser(email, password) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw boom.unauthorized();
    }

    delete user.dataValues.password;

    return user;
  }

  signToken(user) {
    const payload = {
      sub: user.id,
      role: user.role,
    };
console.log(payload)
    const token = jwt.sign(payload, config.jwtSecret);

    return {
      user,
      token,
    }; //el usuer que entrega el middelware de passport
  }
  async sendMail() {
//primero verificamos si el correo existe en la BD
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }

    //se crea el transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: config.usrEmail,
            pass: config.usrPass
            }
    });

    //por el momento me envio el correo a mi mismo.
    let info = await transporter.sendMail({
        from: config.usrEmail, // sender address
        to: user.email, // list of receivers
        subject: "HOLA MUNDO!! desde NODE and EXPRESS", // Subject line
        text: "HOLA MUNDO!! desde NODE and EXPRESS", // plain text body
        html: "<b>Hola Mudno desde node JS</b>", // html body
      });


      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    
  }
}

module.exports = AuthService;
