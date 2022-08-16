const { response, request } = require('express');
const { Categoria } = require('../models');

// Obtener categorias -paginado - total - populate
const categoriasGet = async ( req = request, res = response ) => {

    const { limit, desde} = req.query;
    const query = { estado: true };

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
                 .populate("usuario", "nombre")
                 .skip(Number (desde))
                 .limit(Number (limit))
    ])
    
    res.json({
        total, categorias
    })
}
//Obtener Categoria - populate {}

const categoriaGet = async ( req = request, res = response ) =>{

    const { id } = req.params;

    const dataCategoria = await Categoria.findById( id )
                                        .populate("usuario", "nombre");
    console.log(dataCategoria);
    res.json({
        dataCategoria
    })

}

const crearCategoria =  async ( req, res = response ) => {
    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB =  await Categoria.findOne({ nombre });
    
    if ( categoriaDB ) {
        return res.status(400).json({
            msg:`La categoria ${ categoriaDB.nombre }, ya  existe`
        })
    }

    //Generar la data a guardar    
    const data = {
        nombre,
        usuario: req.usuarioAuth._id
    }

    const newCategoria = new Categoria( data );
    await newCategoria.save();
    
    res.status(201).json({
        newCategoria
    })
}

// Actualizar Categoria
const actualizarCategoria = async ( req = request, res = response ) => {

    const { id } = req.params;
    const { usuarioAuth, estado, ...data } = req.body;
    console.log(req.usuarioAuth)
    data.nombre =  data.nombre.toUpperCase();
    data.usuario = req.usuarioAuth._id;

    const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true });
    res.json({categoria});
}

const borrarCategoriporId = async ( req = request, res = response ) =>{
    const { id } = req.params;
    const deleteCategoria = await Categoria.findByIdAndUpdate( id, { estado: false }, { new: true });

    res.json({
        msg: "Categoria borrada con éxito",
        deleteCategoria
    })
}
//BorrarCategoria - estado = false
module.exports = {
    crearCategoria,
    categoriasGet,
    categoriaGet,
    actualizarCategoria,
    borrarCategoriporId
}