const { response, request } = require("express");


const esAdminRole = ( req, resp = response, next ) => {

    if( !req.usuarioAuth ){
        return resp.status(400).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        })  
    }

    const { rol, nombre } = req.usuarioAuth;

    if( rol !== 'ADMIN_ROL' ){
        return resp.status(401).json({
            msg: `${ nombre } no es un administrador - No puede hacer esto`
        })  
    }

    next();
}

const tieneRole = ( ...roles ) => {


    return ( req, resp = response, next ) => {

        console.log(roles);

        if( !req.usuarioAuth ){
            return resp.status(500).json({
                msg:'Se quiere verificar el rol sin validar el token primero'
            })
        }

        if( !roles.includes( req.usuarioAuth.rol ) ){
            return resp.status(401).json({
                msg: `El servicio requiere uno de estos roles ${ roles }`
            })
        }
        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}