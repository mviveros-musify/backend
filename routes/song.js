'use strict';

const express = require('express');
const SongCtrl = require('../controllers/song');
const api = express.Router();
const md_auth = require('../middlewares/authenticated');

const multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './uploads/albums' });

api.get('/song/:id', md_auth.ensureAuth, SongCtrl.getSong);


module.exports = api;