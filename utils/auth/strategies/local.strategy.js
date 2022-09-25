const { Strategy } = require('passport-local');
const UserService = require('./../../../services/user.service');
const service = new UserService();

const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
//primer parametro el contructor para poder cambiar el 
//nombre d elos parametros que vienen desde la peticion si no se usa, username, password
const LocalStrategy = new Strategy({
    usernameField: 'email',
    passwordField: 'password',
},
    async (email, password, done) => {

        try {
            const user = await service.findByEmail(email);
            if (!user) {
                done(boom.unauthorized(), false)//si hay un error
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                done(boom.unauthorized(), false)
            }
            delete user.dataValues.password;
            done(null, user);//salio todo ok
        } catch (error) {
            console.log(error);
            done(error, false);
        }

    });

module.exports = LocalStrategy;