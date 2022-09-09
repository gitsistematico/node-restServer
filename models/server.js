const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../database/confing');


class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.pahts = {
            authPath:          '/api/auth',
            categorias:        '/api/categorias',
            productos:         '/api/productos',
            usuariosRoutePath: '/api/usuarios',
            consultasVarias:   '/api/consultas',
            uploads:           '/api/uploads',
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
        this.app.use( express.static('public') );
        //Carga de Archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
        
    }

    routes(){
        this.app.use(this.pahts.authPath, require('../routes/auth'))
        this.app.use(this.pahts.usuariosRoutePath, require('../routes/usuarios'))
        this.app.use(this.pahts.productos, require('../routes/productos'))
        this.app.use(this.pahts.categorias, require('../routes/categorias'))
        this.app.use(this.pahts.consultasVarias, require('../routes/buscar'))
        this.app.use(this.pahts.uploads, require('../routes/uploads'))
        
    }

    listen(){
        this.app.listen( this.port );
    }
}

module.exports = Server;