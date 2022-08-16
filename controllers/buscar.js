const { response } = require('express');
const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    'categoria',
    'productos',
    'roles',
    'usuarios'
];

const bucarUsuarios = async( termino = '', res = response ) =>{

    const esMogoID = ObjectId.isValid( termino );

    if ( esMogoID ) {
        const usuario = await Usuario.findById(termino);        
        return res.json({
           results: (usuario) ? [ usuario ] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    const usuarios = await Usuario.find({ 
        $or: [{ nombre: regex }, { correo:regex }],
        $and: [{ estado:true }]
    });

    return res.json({
        results: usuarios
     });
}

const bucarProductos = async( termino = '', res = response ) =>{

    const esMogoID = ObjectId.isValid( termino );

    if ( esMogoID ) {
        const producto = await Producto.findById(termino)
                                       .populate('categoria','nombre');        
        return res.json({
           results: (producto) ? [ producto ] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({ nombre: regex , estado:true })
                                    .populate('categoria','nombre');
    return res.json({
        results: productos
     });
}


const bucarcategoria = async( termino = '', res = response ) =>{

    const esMogoID = ObjectId.isValid( termino );

    if ( esMogoID ) {
        const categoria = await Categoria.findById(termino);        
        return res.json({
           results: (categoria) ? [ categoria ] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({ nombre: regex , estado:true });

    return res.json({
        results: categorias
     });
}

const buscar = ( req, res = response) => {

    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidas.includes( coleccion )) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            bucarUsuarios(termino,res);
        break;
        case 'categoria':
            bucarcategoria(termino,res);
        break;
        case 'productos':
            bucarProductos(termino,res);
        break;
        default:
            res.status(500).json({
                msg: "Esta busqueda no existe"
            })
    }
}

module.exports = {
    buscar
}