const { response, request } = require('express');

const usuariosGet = (req = request, res = response) => {
    
    const { q, nombre, apiKey, page = 10, limit = 5} = req.query;

    res.json({
        msg: 'get Api *- controlador',
        q, 
        nombre, 
        apiKey,
        page,
        limit
    });
}

const usuariosPut = (req = request, res = response) => {

    const { id } = req.params;
    res.json({
        msg: 'get Put *- controlador',
        id
    });
}

const usuariosPost = (req = request, res = response) => {

    const {nombre, edad} = req.body;

    res.json({
        msg: 'get Post *- controlador',
        nombre, 
        edad
    });
}

const usuariosDelete = (req = request, res = response) => {
    res.json({
        msg: 'get Delete *- controlador'
    });
}

const usuariosPatch = (req = request, res = response) => {
    res.json({
        msg: 'get Patch *- controlador'
    });
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}