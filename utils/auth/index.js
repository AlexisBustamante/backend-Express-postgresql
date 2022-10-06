const passport = require('passport');
//aca puedo agregar las diferentes estrategas, 
//como tambien poder logear facebook,twitter etc.
const LocalStrategy = require('./strategies/local.strategy');

passport.use(LocalStrategy);