// 'use strict';

const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT || 3977;

mongoose.connect('mongodb://localhost:27017/musify',{
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, res)=>{
    if(err) throw err;
    else{
        console.log('La base de datos esta corriendo correctamente.');
        app.listen(port, ()=>{
            console.log('Servidor API-Rest escuchando en: http://localhost:3977');
        });
    }
});