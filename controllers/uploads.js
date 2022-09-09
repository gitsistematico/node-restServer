const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL )

const { response } =  require('express');
const { subirArchivo } = require('../helpers');

const { Usuario, Producto } = require('../models')

const cargarArchivos = async ( req, res = response ) =>{    
 
     try {
         const pathCompleto = await subirArchivo( req.files, undefined, 'imgs' );
         return res.json({
             path: pathCompleto
         })        
     } catch (error) {
        res.status(400).json({ error })
     }

}

const actualizarImagen = async ( req, res = response ) =>{

    const { coleccion, id } =  req.params;
    let modelo;
    switch( coleccion ){
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                })
            }
        break;
        case 'productos':
            modelo = await Producto.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                })
            }
        break;        
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto'});
    }
    // limpiar imagenes previas
    if ( modelo.img ) {
        // borrar la imagen del servidor
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
        if ( fs.existsSync( pathImagen ) ) {
            fs.unlinkSync(pathImagen);
        }

    }
    const pathCompleto = await subirArchivo( req.files, undefined, coleccion);
    modelo.img = pathCompleto;
    await modelo.save();

    res.json({
        modelo
    })
}

const actualizarImagenCloudinary = async ( req, res = response ) =>{

    const { coleccion, id } =  req.params;
    let modelo;
    switch( coleccion ){
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                })
            }
        break;
        case 'productos':
            modelo = await Producto.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                })
            }
        break;        
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto'});
    }
    // limpiar imagenes previas
    if ( modelo.img ) {
        // borrar la imagen del servidor
        const nombreImgCloud = modelo.img.split('/');
        const nombre = nombreImgCloud[ nombreImgCloud.length - 1 ];
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url }  = await cloudinary.uploader.upload(tempFilePath)
    // const pathCompleto = await subirArchivo( req.files, undefined, coleccion);
    modelo.img = secure_url;
    await modelo.save();
    res.json({
        modelo
    })

}

const mostrarImagen = async ( req, res = response ) => {
    
    const { coleccion, id } =  req.params;
    let modelo;
    switch( coleccion ){
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                })
            }
        break;
        case 'productos':
            modelo = await Producto.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                })
            }
        break;        
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto'});
    }
    // limpiar imagenes previas
    if ( modelo.img ) {
        // borrar la imagen del servidor
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
        if ( fs.existsSync( pathImagen ) ) {
            return res.sendFile( pathImagen );
        }

    }

    imgNoxist = path.join( __dirname, '../assets/no-image.jpg' );
    return res.sendFile( imgNoxist );
    // res.json({ msg: 'falta place holder' })
}

module.exports = {
    cargarArchivos,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}