'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'clave_secreta_musify';

exports.ensureAuth = (req,res,next)=>{
    if (!req.headers.authorization) return res.status(403).send({ message: 'La peticion no tiene la cabecera de authorization.' });

    const token = req.headers.authorization.replace(/['"]+/g,'');
    let payload = undefined;

    try{
        payload = jwt.decode(token, secret);
        if(payload.exp <= moment().unix()) return res.status(401).send({ message: 'El token ha expirado.' });
    } catch (ex){
        return res.status(403).send({ message: 'Token no valido' });
    };

    req.user = payload;
    next();
};