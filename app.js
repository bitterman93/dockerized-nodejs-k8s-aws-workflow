const express = require('express');
const { expressjwt: expressJwt } = require('express-jwt');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());

const apiKey = '2f5ae96c-b558-4c7b-a590-a501ae1c3f6c';
const jwtSecret = 'assessmentSK';

app.use(expressJwt({ secret: jwtSecret, algorithms: ['HS256'], credentialsRequired: true }));

app.post('/DevOps', (req, res) => {
  if (req.headers['x-parse-rest-api-key'] !== apiKey) {
    res.status(403).send('Forbidden');
    return;
  }

  const {
    message,
    to,
    from,
    timeToLifeSec,
  } = req.body;

  if (message && to && from && timeToLifeSec) {
    res.status(200).json({
      message: `Hello ${to}, your message will be send`,
    });
  } else {
    res.status(400).send('Bad Request');
  }
});

app.use((err, req, res, next) => {
  if (req.method === 'GET') {
    res.status(405).send('Method Not Allowed');
  }
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Unauthorized');
  }
  next();
});

app.use('*', (req, res) => {
  res.status(405).send('ERROR');
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

global.server = server;
process.on('SIGTERM', () => {
  console.log('Closing http server.');
  server.close(() => {
    console.log('Http server closed.');
  });
});

module.exports = app;
