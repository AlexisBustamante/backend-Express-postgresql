const { Strategy } = require('passport-local');
//const UserService = require('./../../../services/user.service');
const AuthService = require('./../../../services/auth.services');
const service = new AuthService();
//primer parametro el contructor para poder cambiar el 
//nombre d elos parametros que vienen desde la peticion si no se usa, username, password
const LocalStrategy = new Strategy({
    usernameField: 'email',
    passwordField: 'password',
},
    async (email, password, done) => {

        try {
            const user = await service.getUser(email,password);
            done(null, user);//salio todo ok
        } catch (error) {
            done(error, false);
        }

    });

module.exports = LocalStrategy;