/* eslint-disable no-unused-vars */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');

const { createErrorResponse } = require('./utils/response');

const app = express();
const dbConnection = require('./mongoose-client');
const config = require('./config/config');
const v1Routes = require('./routes/v1');

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
app.options('*', cors());

app.use('/v1', v1Routes);
app.use((err, req, res, next) => {
  createErrorResponse(err, res);
});

const httpServer = http.createServer(app);
dbConnection();
httpServer.listen(config.port, () => {
  console.log(`🚀 Server ready at http://localhost:${config.port}/`);
});

