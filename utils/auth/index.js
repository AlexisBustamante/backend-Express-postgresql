const passport = require('passport');
//aca puedo agregar las diferentes estrategas, 
//como tambien poder logear facebook,twitter etc.
const LocalStrategy = require('./strategies/local.strategy');
const JwtStrategy= require('./strategies/jwt.strategy');

passport.use(LocalStrategy);
passport.use(JwtStrategy);