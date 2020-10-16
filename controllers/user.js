'use strict';

const fs     = require('fs');
const path   = require('path');
const bcrypt = require('bcrypt-nodejs');
const User   = require('../models/user');
const jwt    = require('../services/jwt');


function pruebas(req, res){
    res.status(200).send({
        message: 'Probando una Accion en un Controlador de Usuarios del API-REST.'
    });
};

const registerUser = (req, res)=>{
    const params = req.body;
    let user =  new User();

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_ADMIN';
    user.image = null;
    
    if(params.password){
        bcrypt.hash(params.password, null, null, (err, hash)=>{
            user.password = hash;
            if(user.name != null && user.surname != null && user.email != null){
                // Guardar el Usuario
                user.save((err, userStored)=>{
                    if(err){
                        res.status(500).send({ message: 'Error al Guardar el Usuario.' });
                    }else{
                        if(!userStored){
                            res.status(404).send({ message: 'No se ha registrado el Usuario.' });
                        }else{
                            res.status(200).send({ user: userStored });
                        };
                    };
                });
            }else{
                res.status(200).send({ message: 'Rellena todos los campos.' });
            };
        });
    }else{
        res.status(200).send({ message: 'Introduce una Contraseña.' });
    };
};

const loginUser = (req, res)=>{
    const params = req.body;
    let email = params.email;
    let password = params.password;

    User.findOne({ email: email.toLowerCase() }, (err, user)=>{
        if(err){
            res.status(500).send({ message: 'Error en la petición.' });
        }else{
            if(!user){
                res.status(404).send({ message: 'El Usuario no Existe.' });
            }else{
                bcrypt.compare(password, user.password, (err, check)=>{
                    if(check){
                        if(params.gethash){
                            res.status(200).send({ token: jwt.createToken(user) });
                        }else{
                            res.status(200).send({user});
                        };
                    }else{
                        res.status(404).send({ message: 'El Usuario no ha podido Loguearse.' });
                    };
                });
            };
        };
    });
};

const updateUser = (req, res)=>{
    const userId = req.params.id;
    const update = req.body;

    User.findByIdAndUpdate(userId, update, (err, userUpdate)=>{
        if(err){
            res.status(500).send({ message: 'Error al actualizar el usuario.' });
        } else{
            if (!userUpdate){
                res.status(404).send({ message: 'No se ha podido actualizar el usuario.' });
            } else{
                res.status(200).send({ user: userUpdate });
            };
        };
    });

};

const uploadImage = (req, res)=>{
    const userId = req.params.id;
    let file_name = 'No subido...';
    if(req.files){
        const file_path = req.files.image.path;
        const file_split = file_path.split('\\');
        file_name = file_split[2];

        const ext_split = file_name.split('\.');
        const file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            User.findByIdAndUpdate(userId, { image: file_name }, (err, userUpdate) => {
                if (!userUpdate){
                    res.status(404).send({ message: 'No se ha podido actualizar el usuario.' });
                } else{
                    res.status(200).send({ image: file_name, user:userUpdate });
                }
            });
        }else res.status(200).send({ message: 'Extension del archivo no valida.' });
    }else res.status(200).send({ message: 'No se ha subido ninguna imagen...' });
};

const getImageFile = (req, res)=>{
    const imgFile = req.params.imageFile;
    const path_file = './uploads/users/' + imgFile;

    fs.exists(path_file, function(exists){
        if(exists) res.sendFile(path.resolve(path_file));
        else res.status(200).send({ message: 'No existe la imagen.' });
    });
};

module.exports = {
    pruebas,
    registerUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};