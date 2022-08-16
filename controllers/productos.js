const { response, request } = require('express');
const { Producto } = require('../models');

// Obtener categorias -paginado - total - populate
const productosGet = async ( req = request, res = response ) => {
    console.log("entro a buscar varios")
    const { limit, desde} = req.query;
    const query = { estado: true };

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
                 .populate("usuario", "nombre")
                 .populate("categoria", "nombre")
                 .skip(Number (desde))
                 .limit(Number (limit))
    ])
    
    res.json({
        total, productos
    })
}

//Obtener Categoria - populate {}

const productoGet = async ( req = request, res = response ) =>{
console.log("entro a buscar 1")
    const { id } = req.params;

    const dataProducto = await Producto.findById( id )
                                        .populate("usuario", "nombre")
                                        .populate("categoria", "nombre");
    console.log(dataProducto);
    res.json({
        dataProducto
    })

}

const crearProducto = async ( req =request, resp = response ) => {
    
    const { estado, usuario, ...dataProducto } = req.body;
    const nombre = dataProducto.nombre.toUpperCase();    
    const productoDB = await Producto.findOne({ nombre });

    if ( productoDB ) {
        return resp.status(400).json({
            msg:`El producto ${ productoDB.nombre }, ya  existe`
        })
    }

    const dataP = {
        nombre,
        usuario: req.usuarioAuth._id,
        precio: dataProducto.precio,
        categoria: dataProducto.idCategoria,
        descripcion: dataProducto.descripcion
    }
    const newProducto = new Producto( dataP );
    await newProducto.save();
    resp.status(201).json({
        newProducto
    })
}


// Actualizar Categoria
const actualizarProducto = async ( req = request, res = response ) => {

    const { id } = req.params;
    const { usuarioAuth, estado, ...data } = req.body;
    // console.log(req.usuarioAuth)
    if( data.nombre ){
        data.nombre =  data.nombre.toUpperCase();
    }

    data.usuario = req.usuarioAuth._id;

    const prodcuto = await Producto.findByIdAndUpdate( id, data, { new: true });
    res.json({prodcuto});
}


const borrarProductoporId = async ( req = request, res = response ) =>{
    const { id } = req.params;
    console.log( id );
    const deleteProducto = await Producto.findByIdAndUpdate( id, { estado: false }, { new: true });

    res.json({
        msg: "Producto borrada con éxito",
        deleteProducto
    })
}

module.exports = {
    productosGet,
    productoGet,
    crearProducto,
    actualizarProducto,
    borrarProductoporId    
}