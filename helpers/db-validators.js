const Rol = require('../models/role');
const Usuario = require('../models/usuario');

const esRolValido = async( rol = '' ) => {
    console.log( "entro el rol", rol )
    
    const existeRol = await Rol.findOne( { rol } );
    console.log("existeRol",existeRol);
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


module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId
}
