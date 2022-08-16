const jwt = require('jsonwebtoken');

const generarJWT = ( uid = '', rol = '' ) => {

    return new Promise( ( resolve, reject) => {

        const payload = { uid , rol };

        jwt.sign( payload, process.env.SECRETORPRIVATEKEY,{
            expiresIn: '8h'
        }, ( err, token ) =>{
            if( err ){
                console.log(err);
                reject('No es posible generar l token');
            }else{
                resolve( token );
            }
        })
    })
}


module.exports = {
    generarJWT
}