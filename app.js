'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Cargar Rutas
var user_routes = require('./routes/user');

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configurar Cabeceras HTTP

// Rutas Base
app.use('/api', user_routes);

module.exports = app;