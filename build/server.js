/** source/server.ts */
import http from 'http';
import express from 'express';
import routes from './routes/routes';

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const router = express();
router.use(express.urlencoded({ extended: false }));
router.use(express.json());
// Cors set-up
// eslint-disable-next-line consistent-return
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
    return res.status(200).json({});
  }
  next();
});
// Routes
// Swagger set-up
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));
router.use('/', routes);
// Error handling
router.use((req, res) => {
  const error = new Error('not found');
  return res.status(404).json({
    message: error.message,
  });
});
// Server
const httpServer = http.createServer(router);
const PORT = process.env.PORT ?? 6060;
// eslint-disable-next-line no-console
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
