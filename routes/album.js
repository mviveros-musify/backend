'use strict';

const express = require('express');
const AlbumCtrl = require('../controllers/album');
const api = express.Router();
const md_auth = require('../middlewares/authenticated');

const multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './uploads/albums' });

api.get('/album/:id', md_auth.ensureAuth, AlbumCtrl.getAlbum);
api.get('/albums/:artist?', md_auth.ensureAuth, AlbumCtrl.getAlbums);
api.get('/get-image-album/:imageFile', AlbumCtrl.getImageFile);

api.post('/album', md_auth.ensureAuth, AlbumCtrl.saveAlbum);
api.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload], AlbumCtrl.uploadImage);

api.put('/album/:id', md_auth.ensureAuth, AlbumCtrl.updateAlbum);

api.delete('/album/:id', md_auth.ensureAuth, AlbumCtrl.deleteAlbum);


module.exports = api;