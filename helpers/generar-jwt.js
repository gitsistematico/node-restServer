const jwt = require('jsonwebtoken');

const generarJWT = ( uid = '' ) => {

    return new Promise( ( resolve, reject) => {

        const payload = { uid };

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