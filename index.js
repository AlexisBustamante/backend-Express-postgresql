const express = require('express');
const cors = require('cors');
const routerApi = require('./routes');
const { checkApiKey } = require('./middlewares/auth.handler');
const { logErrors, errorHandler, boomErrorHandler } = require('./middlewares/error.handler');
const app = express();
const port = process.env.PORT || 3000;
const morgan = require('morgan');
const helmet = require('helmet');
const passport = require('passport')
const path = require('path');
const cookieParser = require("cookie-parser");

const staticPath = path.join(__dirname, 'dist'); // Asegúrate de que 'dist' sea tu directorio de build de Vite
app.use(express.static(staticPath));

app.use(cookieParser());
app.use(morgan('tiny'));
app.use(helmet());
app.use(express.json());
app.disable('x-powered-by');
//para validar desde que aplicaicon pueden preguntar a la api, solo 
const whitelist = ['http://localhost:8080', 'https://myapp.co','http://localhost:6060','https://orlok.netlify.app'];
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('no permitido'));
    }
  },
  credentials: true// Permite cookies en las solicitudes
}
app.use(cors(options));
require('./utils/auth');
// app.get('/', (req, res) => {
//   res.send('Hola mi server en express');
// });
// Antes de nuestras rutas debemos de colocar esto
app.use(passport.initialize());
// app.get('/nueva-ruta', checkApiKey, (req, res) => {
//   res.send('Hola, soy una nueva ruta');
// });
routerApi(app);
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

// Redirige todas las demás rutas al index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

app.listen(port, () => {
  console.log('Mi port' + port);
});
// console.table([{
//   JWT_SECRET:process.env.JWT_SECRET,
//   DB_PASSWORD : process.env.DB_PASSWORD,
//   API_KEY:process.env.API_KEY,
// }]);
