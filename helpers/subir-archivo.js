const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = ( files, extensions = ['png','jpg', 'jpeg', 'gif'], carpeta = '' ) => {

  return new Promise((resolve, reject) => {
    
    const { archivo } = files;
    const nombreCortado = archivo.name.split('.');
    const extension = nombreCortado[ nombreCortado.length - 1 ];
    //validar la extensiones    

    if( !extensions.includes(extension) ){
        return reject('File extensions not permited');        
    }

    const nombreTemp = uuidv4() + '.' + extension;
    const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);
    console.log(uploadPath);
  // Crear la ubicación final
    archivo.mv(uploadPath, function(err) {
      if (err) {
        return res.status(500).join({err});        
      }  
    });
    resolve( nombreTemp );
  })

}

module.exports = {
    subirArchivo
}