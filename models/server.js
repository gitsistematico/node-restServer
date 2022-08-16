const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/confing');


class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.pahts = {
            authPath:           '/api/auth',
            categorias:         '/api/categorias',
            productos:          '/api/productos',
            usuariosRoutePath:  '/api/usuarios',
            consultasVarias:    '/api/consultas',
        }

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
        this.app.use(this.pahts.authPath, require('../routes/auth'))
        this.app.use(this.pahts.usuariosRoutePath, require('../routes/usuarios'))
        this.app.use(this.pahts.productos, require('../routes/productos'))
        this.app.use(this.pahts.categorias, require('../routes/categorias'))
        this.app.use(this.pahts.consultasVarias, require('../routes/buscar'))
    }

    listen(){
        this.app.listen( this.port );
    }
}

module.exports = Server;