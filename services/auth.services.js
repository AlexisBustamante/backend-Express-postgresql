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
    console.log(payload);
    const token = jwt.sign(payload, config.jwtSecret);

    return {
      user,
      token,
    }; //el usuer que entrega el middelware de passport
  }

  async sendMail(infoMail) {
    //se crea el transporter de quien enviará el correo
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: config.usrEmail,
        pass: config.usrPass,
      },
    });

    await transporter.sendMail(infoMail);
     //por el momento me envio el correo a mi mismo.
    //console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview only available when sending through an Ethereal account
    //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return { message: 'mail sended' };
  }

  async sendRecovery(email){
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }

    const payload = {sub:user.id}
    const token = jwt.sign(payload,config.jwtSecret);

    //a este link se le envia al usuario para que desde el 
    //frontend tome el token y cmabie us contrasdeña
    
    const link= `https://myfrontend.com/recovery?token=${token}`

    const mail = {
      from: config.usrEmail, // sender address
      to: user.email, // list of receivers
      subject: 'Email for recovery password', // Subject line
      html: '<b>Ingrea a este link => </b>', // html body
    }

    const rta =await this.sendMail(mail);
    return rta;
  }
}

module.exports = AuthService;
