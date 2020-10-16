'use strict';

const express = require('express');
const SongCtrl = require('../controllers/song');
const api = express.Router();
const md_auth = require('../middlewares/authenticated');

const multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './uploads/songs' });

api.get('/song/:id', md_auth.ensureAuth, SongCtrl.getSong);
api.get('/songs/:album?', md_auth.ensureAuth, SongCtrl.getSongs);
api.get('/get-file-song/:songFile', SongCtrl.getSongFile);

api.post('/song', md_auth.ensureAuth, SongCtrl.saveSong);
api.post('/upload-file-song/:id', [md_auth.ensureAuth, md_upload], SongCtrl.uploadFile);

api.put('/song/:id', md_auth.ensureAuth, SongCtrl.updateSong);

api.delete('/song/:id', md_auth.ensureAuth, SongCtrl.deleteSong);


module.exports = api;