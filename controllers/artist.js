'use strict';

require('mongoose-pagination');

const path = require('path');
const fs   = require('fs');

const Artist = require('../models/artist');
const Album  = require('../models/album');
const Song   = require('../models/song');

const getArtist = (req, res)=>{
    const artistId = req.params.id;

    Artist.findById(artistId, (err, artist)=>{ 
        if(err) res.status(500).send({ message: 'Error en la petición.' });
        else{
            if(!artist) res.status(404).send({ message: 'El Artista no existe' });
            else res.status(200).send({ artist });
        };
    });
};
const getArtists = (req, res)=>{
    const page = (req.params.page) ? req.params.page: 1;
    const itemsPerPage = 3;
    
    Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total)=>{
        if(err) res.status(500).send({ message:'Error en la petición.' });
        else{
            if(!artists) res.status(404).send({ message:'No hay artistas.' });
            else res.status(200).send({ total_items: total, artists });
        };
    });
};


const saveArtist = (req, res)=>{
    const params = req.body;
    let artist = new Artist();

    artist.name        = params.name;
    artist.description = params.description;
    artist.image       = null;

    artist.save((err, artistStored)=>{
        if(err) res.status(500).send({ message: 'Error al guardar el artista.' });
        else{
            if(!artistStored) res.status(404).send({ message: 'El artista no ha sido guardado.' });
            else res.status(200).send({ artist: artistStored });
        };
    });
};

const updateArtist = (req, res)=>{
    const artistId = req.params.id;
    const update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated)=>{
        if(err) res.status(500).send({ message: 'Error al guardar el Artista.' });
        else {
            if(!artistUpdated) res.status(404).send({ message: 'El artista no ha sido actualizado.' });
            else res.status(200).send({ artist: artistUpdated });
        };
    });
};

const deleteArtist = (req, res)=>{
    const artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, (err, artistRemoved)=>{
        if(err) res.status(500).send({ message: 'Error al borrar el Artista.' });
        else{
            if(!artistRemoved) res.status(404).send({ message: 'El artista no ha sido eliminado.' });
            else{
                Album.find({ artist: artistRemoved._id }).deleteMany((err, albumRemoved)=>{
                    if(err) res.status(500).send({ message: 'Error al eliminar el album' });
                    else{
                        if(!albumRemoved) res.status(404).send({ message: 'El album no ha sido eliminado.' });
                        else{
                            Song.find({ album: albumRemoved._id }).deleteMany((err, songRemoved)=>{
                                if(err) res.status(500).send({ message: 'Error al eliminar la Cancion' });
                                else{
                                    if(!songRemoved) res.status(404).send({ message: 'La cancion no ha sido eliminado.' });
                                    else res.status(200).send({ artist: artistRemoved });
                                };
                            });
                        };
                    };
                });
            };
        };
    });
};

const uploadImage = (req, res)=>{
    const artistId = req.params.id;
    let file_name = 'No subido...';
    if(req.files){
        const file_path = req.files.image.path;
        const file_split = file_path.split('\\');
        file_name = file_split[2];

        const ext_split = file_name.split('\.');
        const file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            Artist.findByIdAndUpdate(artistId, { image: file_name }, (err, artistUpdated) => {
                if (!artistUpdated) res.status(404).send({ message: 'No se ha podido actualizar el artista.' });
                else res.status(200).send({ image: file_name, artist: artistUpdated });
            });
        }else res.status(200).send({ message: 'Extension del archivo no valida.' });
    }else res.status(200).send({ message: 'No se ha subido ninguna imagen...' });
};

const getImageFile = (req, res)=>{
    const imgFile = req.params.imageFile;
    const path_file = './uploads/artists/' + imgFile;

    fs.exists(path_file, function(exists){
        if(exists) res.sendFile(path.resolve(path_file));
        else res.status(200).send({ message: 'No existe la imagen.' });
    });
};

module.exports = {
    getArtist,
    getArtists,
    saveArtist,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};