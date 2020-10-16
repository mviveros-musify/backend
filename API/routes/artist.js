'use strict';

const express = require('express');
const ArtistCtrl = require('../controllers/artist');
const api = express.Router();
const md_auth = require('../middlewares/authenticated');

const multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './uploads/artists' });

api.get('/artist/:id', md_auth.ensureAuth, ArtistCtrl.getArtist);
api.get('/artists/:page?', md_auth.ensureAuth, ArtistCtrl.getArtists);
api.get('/get-image-artist/:imageFile', ArtistCtrl.getImageFile);

api.post('/artist', md_auth.ensureAuth, ArtistCtrl.saveArtist);
api.post('/upload-image-artist/:id', [md_auth.ensureAuth, md_upload], ArtistCtrl.uploadImage);

api.put('/artist/:id', md_auth.ensureAuth, ArtistCtrl.updateArtist);

api.delete('/artist/:id', md_auth.ensureAuth, ArtistCtrl.deleteArtist);


module.exports = api;