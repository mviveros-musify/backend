'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configurar Cabeceras HTTP

// Rutas Base
app.get('/pruebas', (req, res)=>{
    res.status(200).send({ message: "Hello World" });
});

module.exports = app;