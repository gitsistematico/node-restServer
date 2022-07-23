const { response } = require('express');
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {
      
        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        // SI el usuario está activo
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        // // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // // Generar el JWT
        console.log(usuario.id);
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }   

}

const googleSingIn = async( req, res = response ) => {
    const { id_token } = req.body;
    
    try {
        const { nombre, img, correo } = await googleVerify( id_token );
        console.log(nombre, img, correo)
        let usuario = await Usuario.findOne( {correo} );
        if ( !usuario ) {
            console.log("usuario vacio", usuario);
            
            const dataUser = {
                nombre,
                correo,
                password: ':p',
                img,
                google: true
            }
            usuario =  new Usuario( dataUser );
            await usuario.save();
        } 

        // Si el usuario en BD esta inactivo
        if( !usuario.estado ){
            res.status(401).json({                
                msg: 'Hable con el administrador, usuario bloqueado',
            })
        }
        // Generar el jwt
        const token =  await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar',
        })
    }
}

module.exports = {
    login,
    googleSingIn
}
