'use strict';

require('mongoose-pagination');

const path = require('path');
const fs   = require('fs');

const Artist = require('../models/artist');
const Album  = require('../models/album');
const Song   = require('../models/song');

const getSong = (req, res)=>{
    // const songId = req.params.id;

    // Song.findById(songId, (err, song)=>{ 
    //     if(err) res.status(500).send({ message: 'Error en la petición.' });
    //     else{
    //         if(!song) res.status(404).send({ message: 'La canción no existe' });
    //         else res.status(200).send({ song });
    //     };
    // });
    res.status(200).send({ message: 'Controlador de Cancion.' });
};

module.exports = {
    getSong
}