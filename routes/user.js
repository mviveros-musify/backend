'use strict';

const express = require('express');
const UserCtrl = require('../controllers/user');
const api = express.Router();
const md_auth = require('../middlewares/authenticated');

const multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './uploads/users' });

api.get('/test', md_auth.ensureAuth, UserCtrl.pruebas);
api.get('/get-image-user/:imageFile', UserCtrl.getImageFile);

api.post('/register', UserCtrl.registerUser);
api.post('/login', UserCtrl.loginUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserCtrl.uploadImage);

api.put('/update-user/:id', md_auth.ensureAuth, UserCtrl.updateUser);


module.exports = api;