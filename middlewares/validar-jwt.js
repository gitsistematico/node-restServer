const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async ( req, resp = response, next ) => {

    const token = req.header('x-token');
    if( !token ){
        
        return resp.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY);
        let _id = uid;
        // Usuario autenticado
        const usuarioAuth = await Usuario.findById( _id )
        if( !usuarioAuth ){
            return resp.status(400).json({
                msg: 'Usuario no existe en Db'
            })            
        }
        //Verificar el estado del usuario logueado para cualquier acción
        if( !usuarioAuth.estado ){
            return resp.status(400).json({
                msg: 'Token no válido - usuario conectado: false'
            })
        }

        req.uid = uid;
        req.usuarioAuth = usuarioAuth;

        next();
    } catch (error) {
        
        console.log(error);
        resp.status(401).json({
            msg: 'Token no valido'
        });
    }
    console.log(token)
    // next();
}

module.exports = {
    validarJWT
}