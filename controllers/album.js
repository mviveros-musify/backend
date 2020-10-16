'use strict';

require('mongoose-pagination');

const path = require('path');
const fs   = require('fs');

const Artist = require('../models/artist');
const Album  = require('../models/album');
const Song   = require('../models/song');
const album = require('../models/album');

const getAlbum = (req, res)=>{
    const albumId = req.params.id;

    Album.findById(albumId, (err, album)=>{ 
        if(err) res.status(500).send({ message: 'Error en la petición.' });
        else{
            if(!album) res.status(404).send({ message: 'El Artista no existe' });
            else res.status(200).send({ album });
        };
    });
};
const getAlbums = (req, res)=>{
    const artistId = req.params.artist;

    let find = undefined;
    if(!artistId) find = Album.find({}).sort('title');
    else find = Album.find({ artist: artistId }).sort('year');

    console.log(find);

    find.populate({ path: 'artist' }).exec((err, albums)=>{
        if(err) res.status(500).send({ message:'Error en la petición.' });
        else{
            if(!albums) res.status(404).send({ message:'No hay albums.' });
            else res.status(200).send({ albums });
        };
    });
};

const saveAlbum = (req, res)=>{
    const params = req.body;
    let album = new Album();

    album.title       = params.title;
    album.description = params.description;
    album.year        = params.year;
    album.artist      = params.artist;
    album.image       = null;

    album.save((err, albumStored)=>{
        if(err) res.status(500).send({ message: 'Error al guardar el artista.' });
        else{
            if(!albumStored) res.status(404).send({ message: 'El album no ha sido guardado.' });
            else res.status(200).send({ album: albumStored });
        };
    });
};

const updateAlbum = (req, res)=>{
    const albumId = req.params.id;
    const update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated)=>{
        if(err) res.status(500).send({ message: 'Error al guardar el Album.' });
        else {
            if(!albumUpdated) res.status(404).send({ message: 'El album no ha sido actualizado.' });
            else res.status(200).send({ album: albumUpdated });
        };
    });
};

const deleteAlbum = (req, res)=>{
    const albumId = req.params.id;

    Album.findByIdAndRemove(albumId, (err, albumRemoved)=>{
        if(err) res.status(500).send({ message: 'Error al eliminar el album' });
        else{
            if(!albumRemoved) res.status(404).send({ message: 'El album no ha sido eliminado.' });
            else{
                Song.find({ album: albumRemoved._id }).deleteMany((err, songRemoved)=>{
                    if(err) res.status(500).send({ message: 'Error al eliminar la Cancion' });
                    else{
                        if(!songRemoved) res.status(404).send({ message: 'La cancion no ha sido eliminado.' });
                        else res.status(200).send({ album: albumRemoved });
                    };
                });
            };
        };
    });
};

const uploadImage = (req, res)=>{
    const albumId = req.params.id;
    let file_name = 'No subido...';
    if(req.files){
        const file_path = req.files.image.path;
        const file_split = file_path.split('\\');
        file_name = file_split[2];

        const ext_split = file_name.split('\.');
        const file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            Album.findByIdAndUpdate(albumId, { image: file_name }, (err, albumUpdated) => {
                if (!albumUpdated) res.status(404).send({ message: 'No se ha podido actualizar el album.' });
                else res.status(200).send({ image: file_name, album: albumUpdated });
            });
        }else res.status(200).send({ message: 'Extension del archivo no valida.' });
    }else res.status(200).send({ message: 'No se ha subido ninguna imagen...' });
};

const getImageFile = (req, res)=>{
    const imgFile = req.params.imageFile;
    const path_file = './uploads/albums/' + imgFile;

    fs.exists(path_file, function(exists){
        if(exists) res.sendFile(path.resolve(path_file));
        else res.status(200).send({ message: 'No existe la imagen.' });
    });
};


module.exports = {
    getAlbum,
    getAlbums,
    saveAlbum,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}