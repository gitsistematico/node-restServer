const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/confing');


class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosRoutePath = '/api/usuarios';
        //Conectar a base de datos
        this.conectionDb();
        //Middlewares
        this.middlewares();
        //Rutas de mi aplicacion
        this.routes();        
    }

    async conectionDb(){
        await dbConnection();
    }
    
    middlewares(){
        //Cors
        this.app.use(cors());
        // Lectura y parceo del body
        this.app.use( express.json() );
        //Directori publico
        this.app.use( express.static('public') )
    }

    routes(){
        this.app.use(this.usuariosRoutePath, require('../routes/usuarios'))
    }

    listen(){
        this.app.listen( this.port );
    }
}

module.exports = Server;