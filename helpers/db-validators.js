const Rol = require('../models/role');
const {Usuario,Categoria,Producto} = require('../models');


const esRolValido = async( rol = '' ) => {
    console.log( "entro el rol", rol )
    
    const existeRol = await Rol.findOne( { rol } );
    // console.log("existeRol",existeRol);
    if( !existeRol ){
        throw new Error(`El rol ${ rol } no está resgistrado en la BD`);
    }
    
}

const emailExiste = async( correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });
    if( existeEmail ){
        throw new Error(`El correo ${ correo } ya esta registrado`);
    }
}

const existeUsuarioPorId = async( id ) => {
    const existeUser = await Usuario.findById( id );
    if( !existeUser ){
        throw new Error(`El usuario ${ id } no esta registrado`);
    }
}

const existeCategoriaporId = async ( id ) =>{
    const existeCategoria = await Categoria.findById( id );
    if( !existeCategoria ){
        throw new Error(`La categoria ${ id } no esta registrado`);
    }
}

const existeProductoId = async ( id ) =>{
    const existeProducto = await Producto.findById( id );
    if( !existeProducto ){
        throw new Error(`La Producto ${ id } no esta registrado`);
    }
}   

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaporId,
    existeProductoId
}
