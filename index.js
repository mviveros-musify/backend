// 'use strict';

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/musify',{
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, res)=>{
    if(err) throw err;
    else console.log('La base de datos esta corriendo correctamente.');
});