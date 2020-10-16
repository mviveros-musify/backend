'use strict';

require('mongoose-pagination');

const path = require('path');
const fs   = require('fs');

const Artist = require('../models/artist');
const Album  = require('../models/album');
const Song   = require('../models/song');

const getSong = (req, res)=>{
    const songId = req.params.id;

    Song.findById(songId).populate({ path: 'album' }).exec((err, song)=>{
        if(err) res.status(500).send({ message: 'Error en la peticion' });
        else{
            if(!song) res.status(404).send({ message: 'No existe esa cancion' });
            else res.status(200).send({song});
        };
    });
};
const getSongs = (req, res)=>{
    const albumId = req.params.album;

    let find = undefined;
    if(!albumId) find = Song.find({}).sort('number');
    else find = Song.find({ album: albumId }).sort('number');

    find.populate({
        path:'album',
        populate: { path:'artist', model: 'Artist' }
    }).exec((err, songs)=>{
        if(err) res.status(500).send({ message: 'Error en la peticion' });
        else{
            if(!songs) res.status(404).send({ message: 'No hay Canciones' });
            else res.status(200).send({ songs });
        };
    });
};

const saveSong = (req, res)=>{
    const params = req.body;
    let song = new Song();

    song.number   = params.number;
    song.name     = params.name;
    song.duration = params.duration;
    song.file     = null;
    song.album    = params.album;

    song.save((err, songStored)=>{
        if(err) res.status(500).send({ message: 'Error en el servidor' });
        else{
            if(!songStored) res.status(404).send({ message: 'No se ha guardado la cancion' });
            else res.status(200).send({ song: songStored });
        }
    });
};

const updateSong = (req, res)=>{
    const songId = req.params.id;
    const update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, songUpdated)=>{
        if(err) res.status(500).send({ message: 'Error en el servidor' });
        else{
            if(!songUpdated) res.status(404).send({ message: 'No se ha actualizado la cancion' });
            else res.status(200).send({ song: songUpdated });
        };
    });
};

const deleteSong = (req, res)=>{
    const songId = req.params.id
    Song.findByIdAndRemove(songId, (err, songStored)=>{
        if(err) res.status(500).send({ message: 'Error en el servidor' });
        else{
            if(!songStored) res.status(404).send({ message: 'No se ha borrado la cancion' });
            else res.status(200).send({ song: songStored });
        }
    });
};

const uploadFile = (req, res)=>{
    const songId = req.params.id;
    let file_name = 'No subido...';
    if(req.files){
        let file_path = req.files.file.path;
        let file_split = file_path.split('\\');
        file_name = file_split[2];

        let ext_split = file_name.split('\.');
        let file_ext = ext_split[1];

        if(file_ext == 'mp3' || file_ext == 'ogg'){
            Song.findByIdAndUpdate(songId, { file: file_name }, (err, songUpdated)=>{
                if (!songUpdated) res.status(404).send({ message: 'No se ha podido actualizar la cancion.' });
                else res.status(200).send({ song: songUpdated });
            });
        }else res.status(200).send({ message: 'Extension del archivo no valida.' });
    }else res.status(200).send({ message: 'No se ha subido el fichero de audio...' });
};

const getSongFile = (req, res)=>{
    const songFile = req.params.songFile;
    const path_file = './uploads/songs/' + songFile;

    fs.exists(path_file, function(exists){
        if(exists) res.sendFile(path.resolve(path_file));
        else res.status(200).send({ message: 'No existe el fichero de Audio.' });
    });
};

module.exports = {
    getSong,
    getSongs,
    saveSong,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
}