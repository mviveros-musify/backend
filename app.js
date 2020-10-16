'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Cargar Rutas
const user_routes   = require('./routes/user');
const artist_routes = require('./routes/artist');
const album_routes  = require('./routes/album');
const song_routes   = require('./routes/song');

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configurar Cabeceras HTTP
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', "Authorization, X-API-KEY, Origin, X-Reqested-With, Content-Type, Accept, Access-Control-Allow-Request-Method");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});

// Rutas Base
app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);

module.exports = app;